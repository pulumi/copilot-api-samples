import * as readline from "readline";
import * as https from "https";
import { IncomingMessage } from "http";

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

interface ProgramContent {
    code: string;
    language: string;
    plan: {
        instructions: string;
        searchTerms: string[];
    };
}

interface Message {
    role: string;
    content: any; // Using 'any' because content can be string[] or ProgramContent
    kind?: string;
}

interface Response {
    conversationId: string;
    messages: Message[];
}

class CopilotClient {
    private rl: readline.Interface;

    constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
    }

    private async readLine(prompt: string): Promise<string> {
        return new Promise((resolve) => {
            this.rl.question(prompt, (answer) => {
                resolve(answer.trim());
            });
        });
    }

    private async makeRequest(
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
                responseFormatVersion: "2",
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Received status code ${response.status}. Response body: ${text}`);
        }

        return response.json();
    }

    private processMessage(msg: Message) {
        if (msg.role === "assistant") {
            switch (msg.kind) {
                case "response":
                    console.log("\nAssistant:", msg.content);
                    break;
                case "program":
                    const program = msg.content as ProgramContent;
                    console.log("\nInstructions:\n", program.plan.instructions);
                    console.log("\nLanguage:", program.language);
                    console.log("\nCode:\n", program.code);
                    break;
            }
        }
    }

    async run() {
        const copilotUrl = process.env.PULUMI_COPILOT_URL;
        const accessToken = process.env.PULUMI_ACCESS_TOKEN;

        if (!copilotUrl || !accessToken) {
            console.log(
                "Error: PULUMI_COPILOT_URL and PULUMI_ACCESS_TOKEN environment variables must be set"
            );
            process.exit(1);
        }

        const orgId = await this.readLine("Enter your organization: ");
        console.log("\nEnter your questions (press Enter twice to exit):");

        let conversationId: string | undefined;

        while (true) {
            const query = await this.readLine("\nYou: ");

            if (!query) {
                console.log("Goodbye!");
                break;
            }

            try {
                const response = await this.makeRequest(
                    copilotUrl,
                    accessToken,
                    query,
                    orgId,
                    conversationId
                );

                conversationId = response.conversationId;

                for (const msg of response.messages) {
                    this.processMessage(msg);
                }
            } catch (error) {
                console.error("Error:", error);
            }
        }

        this.rl.close();
    }
}

// Run the client
const client = new CopilotClient();
client.run().catch(console.error);
