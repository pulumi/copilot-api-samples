This sample shows how to build a command-line chatbot that can be used to chat with Pulumi Copilot.

To run the program, do `go run main.go`

Below is an example of a chat:

````
$go run main.go

Enter your organization: pulumi

Enter your questions (press Enter twice to exit):

You: Hello!

Assistant: Hello, Artur! How can I assist you today?

You: What is Pulumi ESC?

Assistant: Pulumi ESC (Environments, Secrets, and Configuration) is a secrets management and orchestration service for environments, secrets, and configurations. It helps teams manage secrets and configurations across multiple environments, ensuring security, consistency, and efficiency. Pulumi ESC integrates with popular secrets stores like AWS Secrets Manager, Azure Key Vault, GCP Secret Manager, HashiCorp Vault, and 1Password. It supports dynamic secret providers and dynamic login credentials for cloud providers. Pulumi ESC can be used with Pulumi IaC or as a standalone tool. For more details, you can refer to the [Pulumi ESC documentation](https://www.pulumi.com/docs/esc/).

Here are some useful links to get you started:
- [Pulumi ESC Overview](https://www.pulumi.com/docs/esc/)
- [Pulumi ESC Concepts](https://www.pulumi.com/docs/esc/concepts/)
- [Download & Install Pulumi ESC](https://www.pulumi.com/docs/esc/download-install/)

You: Generate TypeScript code to create an S3 bucket

Assistant: To create an S3 bucket using Pulumi in TypeScript, follow these steps:

1. Initialize a new Pulumi project if you haven't already.
2. Install the necessary Pulumi AWS package.
3. Define and configure the S3 bucket resource in your Pulumi program.
4. Deploy the stack to create the bucket.

Here's a basic example of how to create an S3 bucket:

1. Initialize a new Pulumi project:
```sh
pulumi new aws-typescript
```

2. Install the Pulumi AWS package:
```sh
npm install @pulumi/aws
```

3. Define the S3 bucket in your `index.ts` file:
```typescript
import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

const bucket = new aws.s3.Bucket("my-bucket", {
    acl: "private",
});

export const bucketName = bucket.id;
```

4. Deploy the stack:
```sh
pulumi up
```


Instructions:
To create an S3 bucket using Pulumi in TypeScript, follow these steps:

1. Initialize a new Pulumi project if you haven't already.
2. Install the necessary Pulumi AWS package.
3. Define and configure the S3 bucket resource in your Pulumi program.
4. Deploy the stack to create the bucket.

Here's a basic example of how to create an S3 bucket:

1. Initialize a new Pulumi project:
```sh
pulumi new aws-typescript
```

2. Install the Pulumi AWS package:
```sh
npm install @pulumi/aws
```

3. Define the S3 bucket in your `index.ts` file:
```typescript
import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

const bucket = new aws.s3.Bucket("my-bucket", {
    acl: "private",
});

export const bucketName = bucket.id;
```

4. Deploy the stack:
```sh
pulumi up
```


Language: TypeScript

Code:
import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

const bucket = new aws.s3.Bucket("my-bucket", {
    acl: "private",
});

export const bucketName = bucket.id;

You:

Goodbye!
````
