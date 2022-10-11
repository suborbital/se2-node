<p align="center">
    <a href="https://suborbital.dev/">
        <img src="suborbital-logo.svg" alt="Suborbital" height="200" />
    </a>
</p>

# Suborbital Extension Engine JavaScript SDK

This SDK provides an easy way to interact with the Suborbital Extension Engine API from JavaScript or TypeScript.

## Installation

Install via `yarn`:

```sh
yarn add @suborbital/se2
```

or `npm`:

```sh
npm install @suborbital/se2
```

## Usage

Start by instantiating the client to [SE2](https://suborbital.dev/) with your environment token:

```ts
import { Suborbital, se2UriConfig } from "@suborbital/se2";

const suborbital = new Suborbital(process.env.SUBORBITAL_ENV_TOKEN, se2UriConfig);
```

```ts
import { Suborbital } from "@suborbital/se2";

const suborbital = new Suborbital(process.env.SUBORBITAL_ENV_TOKEN);
```

The URIs for each of the APIs can be configured, if different than the defaults (e.g. self-hosted Suborbital infrastructure):

```ts
import { Suborbital } from "@suborbital/se2";

const config = {
  adminUri: "https://acme.co:8081",
  execUri: "https://acme.co:8080",
  builderUri: "https://acme.co/builder",
};

const suborbital = new Suborbital(process.env.SUBORBITAL_ENV_TOKEN, config);
```

A configuration for a locally-deployed Suborbital Extension Engine (e.g. while developing) is also available:

```ts
import { Suborbital, localUriConfig } from "@suborbital/se2";

const suborbital = new Suborbital(process.env.SUBORBITAL_ENV_TOKEN, localUriConfig);
```

Then access endpoints on their respective sub-clients:

```ts
async function runFunction() {
  const result = await suborbital.exec.run({
    environment: "com.acmeco",
    userId: "1234",
    namespace: "default",
    fnName: "foo",
    version: "v1.0.0",
  });

  console.log("Function output:", result);
}
```
