<p align="center">
    <a href="https://suborbital.dev/">
        <img src="suborbital-logo.svg" alt="Suborbital" height="120" />
    </a>
</p>

# Suborbital Extension Engine (SE2) JavaScript SDK

This SDK provides an easy way to interact with the SE2 API from JavaScript or TypeScript.

## Installation

Install via `yarn`:

```sh
yarn add @suborbital/compute
```

or `npm`:

```sh
npm install @suborbital/compute
```

## Usage

Start by instantiating the client with your environment token:

```ts
import { Suborbital } from "@suborbital/compute";

const suborbital = new Suborbital(process.env.SE2_ENV_TOKEN);
```

The URIs for each of the APIs can be configured, if different than the defaults:

```ts
import { Suborbital } from "@suborbital/compute";

const config = {
  adminUri: "https://acme.co:8081",
  execUri: "https://acme.co:8080",
  builderUri: "https://acme.co/builder",
};

const suborbital = new Suborbital(process.env.SE2_ENV_TOKEN, config);
```

A configuration for a locally-deployed Suborbital Extension Engine is also available:

```ts
import { Suborbital, localUriConfig } from "@suborbital/compute";

const suborbital = new Suborbital(process.env.SE2_ENV_TOKEN, localUriConfig);
```

Then access endpoints on their respective sub-clients:

```ts
async function run() {
  const result = await suborbital.exec.run(
    {
      environment: "com.acmeco",
      userId: "1234",
      namespace: "default",
      name: "hello",
    },
    "world!"
  );

  console.log("Output:", result);
}
```
