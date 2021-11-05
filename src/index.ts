import fetch from 'node-fetch';

import * as administrative from "../compute-typescript-fetch/administrative"
import * as builder from "../compute-typescript-fetch/builder"
import * as execution from "../compute-typescript-fetch/execution"

if (!globalThis.fetch) {
    // @ts-ignore
	globalThis.fetch = fetch;
}

type config = {
    baseUrl?: string;
    accessToken: string;
}

interface suborbital {
    administrative: administrative.DefaultApi;
    builder: builder.DefaultApi;
    execution: execution.DefaultApi;
}

export class Suborbital implements suborbital {
    private _administrative: administrative.DefaultApi
    private _builder: builder.DefaultApi
    private _execution: execution.DefaultApi

    constructor(options: config) {
        this._administrative = new administrative.DefaultApi(new administrative.Configuration(options))
        this._builder = new builder.DefaultApi(new builder.Configuration(options))
        this._execution = new execution.DefaultApi(new execution.Configuration(options))
    }

    get administrative() {
        return this._administrative
    }

    get builder() {
        return this._builder
    }

    get execution() {
        return this._execution
    }
}
