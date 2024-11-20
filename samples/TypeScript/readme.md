This sample shows how to build a command-line chatbot that can be used to chat with Pulumi Copilot.

To run the program, do

```sh
tsc main.ts
node main.js
```

Below is an example of a chat:

```
$tsc main.ts

$node main.js

Enter your organization: pulumi

Enter your questions (press Enter twice to exit):

You: hi

Assistant: Hello Artur! How can I assist you today?

You: What is Pulumi ESC?

Assistant: Pulumi ESC (Environments, Secrets, and Configuration) is a secrets management and orchestration service designed to simplify how organizations manage secrets and configurations across multiple environments. It integrates with popular secrets stores like AWS Secrets Manager, Azure Key Vault, GCP Secret Manager, HashiCorp Vault, and 1Password.

Here are some useful links to get you started:
- [Pulumi ESC Overview](https://www.pulumi.com/docs/esc/): Comprehensive overview of Pulumi ESC.
- [Pulumi ESC Concepts](https://www.pulumi.com/docs/esc/concepts/): Key concepts and how Pulumi ESC works.
- [Pulumi ESC Download & Install](https://www.pulumi.com/docs/esc/download-install/): Instructions on how to download and install Pulumi ESC on various operating systems.

Feel free to explore these resources to learn more about Pulumi ESC and how it can help manage your secrets and configurations securely.

You: Generate code for a static web site in Azure using Python

Assistant: To create a static website in Azure using Pulumi and Python, follow these steps:

1. **Create a new Pulumi project**: Initialize a new Pulumi project with Python as the language.
2. **Install Pulumi Azure provider**: Ensure you have the Pulumi Azure provider installed.
3. **Create an Azure Resource Group**: Define a resource group to contain your resources.
4. **Create an Azure Storage Account**: Set up a storage account to host your static website.
5. **Configure the Storage Account for Static Website Hosting**: Enable static website hosting on the storage account and upload your website files.
6. **Deploy the resources**: Use Pulumi to deploy the defined resources to Azure.

Here are the search terms to find relevant documentation and examples:
- "Pulumi Azure Resource Group"
- "Pulumi Azure Storage Account"
- "Pulumi Azure Static Website"
- "Pulumi Python Azure"
- "Pulumi deploy static website Azure"


Instructions:
To create a static website in Azure using Pulumi and Python, follow these steps:

1. **Create a new Pulumi project**: Initialize a new Pulumi project with Python as the language.
2. **Install Pulumi Azure provider**: Ensure you have the Pulumi Azure provider installed.
3. **Create an Azure Resource Group**: Define a resource group to contain your resources.
4. **Create an Azure Storage Account**: Set up a storage account to host your static website.
5. **Configure the Storage Account for Static Website Hosting**: Enable static website hosting on the storage account and upload your website files.
6. **Deploy the resources**: Use Pulumi to deploy the defined resources to Azure.

Here are the search terms to find relevant documentation and examples:
- "Pulumi Azure Resource Group"
- "Pulumi Azure Storage Account"
- "Pulumi Azure Static Website"
- "Pulumi Python Azure"
- "Pulumi deploy static website Azure"


Language: Python

Code:
import pulumi
import pulumi_azure_native as azure_native

# Create an Azure Resource Group
resource_group = azure_native.resources.ResourceGroup('resourceGroup',
    resource_group_name='example-rg',
    location='WestUS')

# Create an Azure Storage Account
storage_account = azure_native.storage.StorageAccount('storageAccount',
    resource_group_name=resource_group.name,
    account_name='examplestorageacct',
    location=resource_group.location,
    sku=azure_native.storage.SkuArgs(
        name='Standard_LRS'
    ),
    kind='StorageV2')

# Configure the Storage Account for Static Website Hosting
static_website = azure_native.storage.StorageAccountStaticWebsite('staticWebsite',
    resource_group_name=resource_group.name,
    account_name=storage_account.name,
    index_document='index.html',
    error404_document='404.html')

# Export the static website URL
static_website_url = pulumi.Output.concat('https://', storage_account.name, '.z13.web.core.windows.net/')
pulumi.export('static_website_url', static_website_url)

You:
Goodbye!
```
