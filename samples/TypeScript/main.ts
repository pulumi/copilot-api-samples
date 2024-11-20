import * as readline from "readline";

interface CloudContext {
    orgId: string;
    url: string;
}

interface Client {
    cloudContext: CloudContext;
}

interface State {
    client: Client;
}

interface RequestBody {
    conversationId?: string;
    query: string;
    state: State;
}

type MessageContent = string | string[];

interface Message {
    role: string;
    content: MessageContent;
    kind?: string;
}

interface Program {
    code: string;
    language: string;
    plan: {
        instructions: string;
    };
}

interface Response {
    conversationId: string;
    messages: Message[];
    programs?: Program[];
}

async function makeRequest(
    url: string,
    token: string,
    query: string,
    orgId: string,
    conversationId?: string
): Promise<Response> {
    const requestBody: RequestBody = {
        query,
        state: {
            client: {
                cloudContext: {
                    orgId,
                    url: "https://app.pulumi.com",
                },
            },
        },
    };

    if (conversationId) {
        requestBody.conversationId = conversationId;
    }

    const response = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: `token ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
        throw new Error(
            `HTTP error! status: ${response.status}. Response: ${await response.text()}`
        );
    }

    return (await response.json()) as Response;
}

async function readLine(prompt: string, rl: readline.Interface): Promise<string> {
    return new Promise((resolve) => {
        rl.question(prompt, (answer) => {
            resolve(answer.trim());
        });
    });
}

async function main() {
    const copilotUrl = process.env.PULUMI_COPILOT_URL;
    const accessToken = process.env.PULUMI_ACCESS_TOKEN;

    if (!copilotUrl || !accessToken) {
        console.error(
            "Error: PULUMI_COPILOT_URL and PULUMI_ACCESS_TOKEN environment variables must be set"
        );
        process.exit(1);
    }

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    try {
        const orgId = await readLine("Enter your organization: ", rl);

        console.log("\nEnter your questions (press Enter twice to exit):");

        let conversationId: string | undefined;

        while (true) {
            const query = await readLine("\nYou: ", rl);

            if (!query) {
                console.log("Goodbye!");
                break;
            }

            try {
                const response = await makeRequest(
                    copilotUrl,
                    accessToken,
                    query,
                    orgId,
                    conversationId
                );

                conversationId = response.conversationId;

                // Print normal assistant responses
                response.messages.forEach((msg) => {
                    if (msg.role === "assistant" && !msg.kind) {
                        const content =
                            typeof msg.content === "string"
                                ? msg.content
                                : msg.content.join("\n");
                        console.log(`\nAssistant: ${content}`);
                    }
                });

                // Print program information if available
                if (response.programs) {
                    response.programs.forEach((program) => {
                        console.log(`\nInstructions:\n${program.plan.instructions}`);
                        console.log(`\nLanguage: ${program.language}`);
                        console.log(`\nCode:\n${program.code}`);
                    });
                }
            } catch (error) {
                console.error("Error:", error instanceof Error ? error.message : error);
            }
        }
    } finally {
        rl.close();
    }
}

if (require.main === module) {
    main().catch((error) => {
        console.error("Fatal error:", error);
        process.exit(1);
    });
}
