<p align="center">
    <a href="https://suborbital.dev/">
        <img src="suborbital-logo.png" alt="Suborbital" height="200" />
    </a>
</p>

# Getting Started Guide: Client Libraries for Compute

The guide for how to use the typescript client library for Suborbital Compute.

## Overview

This API client was created to make it easier for you to interact with Compute's API's. There are three main API's in Compute:

[Administrative](https://docs.suborbital.dev/connect-your-application/administrative-api) - designed to help you and your users view, manage, and organize their functions.

[Builder](https://docs.suborbital.dev/building-functions/builder-api) - can build TypeScript (AssemblyScript) and Rust functions.

[Execution](https://docs.suborbital.dev/connect-your-application/execution-api) - used by your application servers to execute the functions your users have built.

## Installation

Before you can begin writing functions using this library, you will need to have Suborbital Compute running (locally or through your cloud provider of choice) on your computer. Follow the [Compute Setup Guide]("https://docs.suborbital.dev") to complete that process.

Once you have Compute running, you can install this library to help interact with our APIs.

Run the following via `yarn` or `npm`:

```shell
$yarn add @suborbital/compute
```

OR:

```shell
$npm install @suborbital/compute
```

Next, its time to set up the file you will be using to interact with our API's. If you installed Compute locally, then the top of your file will look like this (where the local config settings are already set within our lib):

```typescript
import { Suborbital, localConfig } from "@suborbital/compute";

const suborbital = new Suborbital(localConfig);
```

If you did not install Compute locally, then import the lib at the top of your file and then set your specific configuration, if different from the defaults. :

```Typescript
import { Suborbital } from "@suborbital/compute"

const suborbital = new Suborbital();

const configuration = {
  adminUri: "https://acme.co:8081",
  execUri: "https://acme.co:8080",
  builderUri: "https://acme.co/builder",
};

const suborbital = new Suborbital(configuration);
```

Now we can move on to using our lib. Here is the full list of functions we can use to interact with our APIs:

### Admin:

suborbital.admin.getToken
suborbital.admin.getFunctions
suborbital.admin.getFunctionResults
suborbital.admin.getFunctionErrors

### Builder:

suborbital.builder.build
suborbital.builder.deployDraft
suborbital.builder.getTemplate

### Exec:

suborbital.exec.run

We will be using the `getFunctions` method in this guide as an example and `run` to execute that method.

The `getFunctions` method takes in a `customerId` and a `namespace` as parameters and returns a list of available functions for the given user in the given namespace.

The `getFunctions` method would look something like this in your file:

```typescript
async function listAvailableFunctions() {
  const functionList = await suborbital.admin.getFunctions({
    customerId: "1234",
    namespace: "default",
  });

  console.log("Function list:", functionList);
}
```

The response will look something like this:

```json
{
    "functionList": [
        {
            "name": "foo",
            "namespace": "...",
            "lang": "...",
            "version": "...",
            "draftVersion": "...",
            "apiVersion": "...",
            "fqfn": "...",
            "fqfnURI": "...",
        }
        ...
    ]
}
```

Now that we have gotten a list of available functions, we now have to execute one of those functions.To do this we will use the `run` execution method from the Execution API.

The execution API specifically is used by your application servers to execute the one of the functions.

Let's take the first function above named `foo` and execute it. You'll see that you specify the function name `fnName` in the parameters to the `run` method along with the 4 other parameters: environment, customerId, namespace, and version. An example is below:

```typescript
async function runFunction() {
  const result = await suborbital.exec.run({
    environment: "com.acmeco",
    customerId: "1234",
    namespace: "default",
    fnName: "foo",
    version: "v1.0.0",
  });

  console.log("Function output:", result);
}
```

Once we run this code, we should either get a 200 response code with the bytes produced by the function OR Non-200 response code with JSON (if the function resulted in an error) that looks like this:

```json
{
  "code": 400,
  "message": "..."
}
```

That's all! Now you know how to fully interact with all of our APi's using our the Suborbital Typescript Client Library. Now you can try calling our api's using the other methods listed above.
