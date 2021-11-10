<p align="center">
    <a href="https://suborbital.dev/">
        <img src="suborbital-logo.png" alt="Suborbital" height="200" />
    </a>
</p>

# Suborbital Compute JavaScript SDK

This SDK provides an easy way to interact with the Suborbital Compute API from JavaScript or TypeScript.

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

```ts
import { Suborbital } from "@suborbital/compute";

const suborbital = new Suborbital();

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
