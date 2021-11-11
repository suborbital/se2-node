# Getting Started Guide: Client Libraries for Compute

The guide for how to use the typescript client library for Suborbital Compute.

## Overview

This API client was created to make it easier for you to interact with Compute's API's.

Today we are going to take you through the steps to use our library to interact with our api's. There are three main Api's [Administrative](https://docs.suborbital.dev/connect-your-application/administrative-api), [Builder](https://docs.suborbital.dev/building-functions/builder-api), and [Execution](https://docs.suborbital.dev/connect-your-application/execution-api) which have pretty extensive documentation and use cases. However, for this guide, we'll chose one method from the Administrative API (`getFunctions` to be exact) and one from the Execution API (`run`).

## Installation

In order to get started using this library, we need to first ensure we have Suborbital Compute running (locally or through a cloud provider of choice) on your computer. Follow the [Compute Setup Guide]("https://docs.suborbital.dev") to complete that process.

Once we have Compute running, we can install this library to help interact with our APIs.

Run the following via `yarn` or `npm`:

```shell
$yarn add @suborbital/compute
```

OR:

```shell
$npm install @suborbital/compute
```

Next, its time to set up the file we will be using to interact with our API's. If we installed Compute locally, then the top of our file will look like this (where the local config settings are already set within our lib):

```typescript
import { Suborbital, localConfig } from "@suborbital/compute";

const suborbital = new Suborbital(localConfig);
```

If we need the library to be used on a production environment for example or we need to use different ports other than the defaults set below, then we should configure those settings. Let's import the lib at the top of our file and then set our specific configuration urls/ports.

```typescript
import { Suborbital } from "@suborbital/compute";

const suborbital = new Suborbital();

const configuration = {
  adminUri: "https://acme.co:8081",
  execUri: "https://acme.co:8080",
  builderUri: "https://acme.co/builder",
};

const suborbital = new Suborbital(configuration);
```

Now we can move on to using our lib.

As stated above, we will be using the `getFunctions` method in this guide as an example and `run` to execute that method.

The `getFunctions` method takes in a `customerId` and a `namespace` as parameters and returns a list of available functions for the given user in the given namespace.

Let's create an asycnhronous function, name it, and then set a promise to the `getFunctions` method. That would look something like this in our file:

```typescript
async function listAvailableFunctions() {
  const functionList = await suborbital.admin.getFunctions({
    customerId: "1234",
    namespace: "default",
  });

  console.log("Function list:", functionList);
}
```

Once we run this code, we should get a response that looks something like this:

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

Note this is exactly what should have returned from the `getFunctions` method, a list of available functions for the given user in the given namespace.

Now that we have gotten this list of available functions, we now have to execute one of those functions. To do this we will use the `run` execution method from the Execution API.

The `run` method executes the given function, with the provided body, params and state loaded into the function at runtime.

Let's take the function `foo` returned from the response above and execute it. You'll see that we specify the function name `fnName` in the parameters to the `run` method along with the 4 other parameters: environment, customerId, namespace, and version. That would look something like this:

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

That's all! We have successfully used this typescript library to interact with a few of our API's. If you'd like to interact with all of our API's, you can use any of the methods below to do so.

Now you can try calling our api's using the other methods listed below.

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

Happy coding!
