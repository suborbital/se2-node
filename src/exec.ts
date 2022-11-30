import axios from "axios";
import { Plugin } from "./types/plugin";
import uriencoded from "./util/uriencoded";

interface ExecConfig {
  baseUrl?: string;
  envToken: string;
}

const EXEC_URI = "http://e2core-service.suborbital.svc.cluster.local";

interface ExecutionResult {
  result: ArrayBuffer;
  uuid: string;
}

export class Exec {
  private baseUrl: string;
  private envToken: string;

  constructor({ baseUrl = EXEC_URI, envToken }: ExecConfig) {
    this.baseUrl = baseUrl;
    this.envToken = envToken;
  }

  @uriencoded
  async run(
    { environment, userId, namespace, pluginName }: Plugin,
    input: String | ArrayBuffer | object
  ): Promise<ExecutionResult> {
    let buffer;
    if (typeof input === "string") {
      buffer = new TextEncoder().encode(input).buffer;
    } else if (input instanceof ArrayBuffer) {
      buffer = input;
    } else {
      buffer = new TextEncoder().encode(JSON.stringify(input)).buffer;
    }
    const response = await axios.post(
      `${this.baseUrl}/name/${environment}.${userId}/${namespace}/${pluginName}`,
      buffer,
      {
        headers: {
          Authorization: `Bearer ${this.envToken}`,
        },
      }
    );
    return {
      result: response.data,
      uuid: response.headers["x-suborbital-requestid"],
    };
  }

  async runRef(
    ref: String,
    input: String | ArrayBuffer | object
  ): Promise<ExecutionResult> {
    let buffer;
    if (typeof input === "string") {
      buffer = new TextEncoder().encode(input).buffer;
    } else if (input instanceof ArrayBuffer) {
      buffer = input;
    } else {
      buffer = new TextEncoder().encode(JSON.stringify(input)).buffer;
    }
    const response = await axios.post(`${this.baseUrl}/ref/${ref}`, buffer, {
      headers: {
        Authorization: `Bearer ${this.envToken}`,
      },
    });
    return {
      result: response.data,
      uuid: response.headers["x-suborbital-requestid"],
    };
  }
}
