# Pulumi Copilot API

In this repo you will find samples and docs for Pulumi Copilot REST APIs.

## Why use Copilot REST APIs?

Copilot REST APIs allow you to integrate Pulumi Copilot capabilities into your own application or workplace collaboration platform such as Slack or Teams.

Copilot APIs unlock capabilities beyond those available in the Pulumi Console, such as:

-   Multi-user interaction within shared channels
-   Automated execution of Copilot queries based on scheduled triggers
-   Event-driven operations that respond to specific actions, such as deployment completions

## What can I do with Copilot APIs?

Using Copilot REST APIs you can submit a query to Copilot such as "Who are the admins in my organization?", or ask a question about a specific resource or an update. Let's look at some examples.

### Initial setup

You will need to set the following environment variables:

```bash
export PULUMI_COPILOT_URL="https://api.pulumi.com/api/ai/chat/preview"
export PULUMI_ACCESS_TOKEN="pul-..."
```

(You can get the actual value for your PULUMI_ACCESS_TOKEN from the Pulumi Console)

### Cloud context parameters

All calls to Copilot API are made in the context of an organization. You will see this in the `orgId` field below.
Additionally, Copilot API needs to know the URL of the resource in Pulumi Console -- think of that as the browser URL in Pulumi Console when you're chatting with Copilot. This is what allows you to refer to it in the query, asking questions like "What happened in _this_ update?". This field must start with `https://app.pulumi.com` optionally followed by a specific resource.

### Calling the API

We're now ready to submit our first request!

The example above uses curl, but you can use other tools such as Postman or `Invoke-WebRequest` in PowerShell.

```
curl -L "$PULUMI_COPILOT_URL" \
-H "Authorization: token $PULUMI_ACCESS_TOKEN" \
-H "Content-Type: application/json" \
-d '{
    "query": "Who are the users in my org?",
    "state": {
        "client": {
            "cloudContext": {
                "orgId": "pulumi",
                "url": "https://app.pulumi.com"
            }
        }
    }
}'
```

The response from the API returns JSON that you will need to parse to extract the results.

### Multi-turn conversations

The HTTP response contains a conversation ID:

```
"conversationId":"369a280c-63f3-4ee6-a13d-c1035a3d05de" ...
```

You will use this conversation ID for multi-turn conversations, in which you can refer to what you or Copilot has said earlier:

```
curl -L "$PULUMI_COPILOT_URL" \
-H "Authorization: token $PULUMI_ACCESS_TOKEN" \
-H "Content-Type: application/json" \
-d '{
    "conversationId":"369a280c-63f3-4ee6-a13d-c1035a3d05de",
    "query": "Who of them are admins?",
    "state": {
        "client": {
            "cloudContext": {
                "orgId": "pulumi",
                "url": "https://app.pulumi.com"
            }
        }
    }
}'
```

Note that Copilot understood who you are referring to in "them" because you continued the conversation that already started. Copilot keeps track of the messages in the conversation based on the conversation ID.

### More samples

More code samples are available in the [samples](https://github.com/pulumi/copilot-api-samples/tree/main/samples) directory.
