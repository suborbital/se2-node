<p align="center">
    <a href="https://suborbital.dev/">
        <img src="suborbital-logo.png" alt="Suborbital" height="200" />
    </a>
</p>

# Node API client for Suborbital

The Node/Typescript client library for Suborbital Compute.

## Overview

This API client was created to make it easier for you to interact with Compute's API's. There are three main API's in Compute:

[Administrative](https://docs.suborbital.dev/connect-your-application/administrative-api) - designed to help you and your users view, manage, and organize their functions.

[Builder](https://docs.suborbital.dev/building-functions/builder-api) - can build TypeScript (AssemblyScript) and Rust functions.

[Execution](https://docs.suborbital.dev/connect-your-application/execution-api) - used by your application servers to execute the functions your users have built.

## Installation

First clone this repo, then run the following via `yarn` or `npm`:

```shell
$yarn add @suborbital/compute
```

OR:

```shell
$npm install @suborbital/compute
```

Once you have installed, you are ready to start using the API!

To begin using our APIs, import the lib at the top of your file:

```Typescript
import { Suborbital } from "@suborbital/compute"

const suborbital = new Suborbital();
```

Next You'll want to edit your configurations for the APIs, if different from the defaults:

```typescript
const config = {
  adminUri: "https://acme.co:8081",
  execUri: "https://acme.co:8080",
  builderUri: "https://acme.co/builder",
};
```

Then you will want instanciate Suborbital with the config:

```typescript
const suborbital = new Suborbital(config);
```

The beginning of your file will look like this:

```typescript
//example
```

And the rest of your file will look like this:

```Typescript
//example
```

You should get an output like:

```Typescript
//token output
```

And that is how you call the API using the Admin GetToken wrapper!

You can use our wrappers for all of our API endpooints:

{Provide Code Examples for Each}

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

{Should we go into structure of each of our 3 main APIs? }

Now let's look at the structure for the Admin API endpoint to understand what parameters the endpoint takes in:

## Documentation for Admin API

All URIs are relative to *https://acme.co:8081*
{local: http://local.suborbital.network:8081/api/v1}

| Class   | Method                                      | HTTP request                                                   | Description |
| ------- | ------------------------------------------- | -------------------------------------------------------------- | ----------- |
| _Admin_ | [**GetToken**](docs/DefaultApi.md#gettoken) | **Get** /token/{environment}.{customerID}/{namespace}/{fnName} |

### Path Parameters

| Name            | Type     | Description                                                 | Notes |
| --------------- | -------- | ----------------------------------------------------------- | ----- |
| **environment** | _string_ | The root compute environment (i.e. the vendor)              |
| **customerID**  | _string_ | The vendor&#39;s customer (i.e. the user)                   |
| **namespace**   | _string_ | The function namespace (vendor-defined groups of functions) |
| **fnName**      | _string_ | The function name (customer-defined)                        |

Call the Api with the set parameters:

Example:

```typescript
const token = await suborbital.admin.getToken({
  environment: "com.acmeco",
  customerId: "1234",
  namespace: "default",
  fnName: "foo",
});
```

### Return type

[**Token**](Token.md) {example of return type from original docs}

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<!-- ## Documentation For Models

 - [Token](docs/Token.md) -->

## Author
