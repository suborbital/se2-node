import axios, { AxiosInstance } from "axios";
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

  private http: AxiosInstance;

  constructor({ baseUrl = EXEC_URI, envToken }: ExecConfig) {
    this.baseUrl = baseUrl;
    this.envToken = envToken;

    this.http = axios.create({
      baseURL: this.baseUrl,
      headers: {
        Authorization: `Bearer ${this.envToken}`,
      },
    });
  }

  @uriencoded
  async run(
    { environment, userId, namespace, name }: Plugin,
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
    const response = await this.http.post(
      `/name/${environment}.${userId}/${namespace}/${name}`,
      buffer
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
    const response = await this.http.post(`/ref/${ref}`, buffer);
    return {
      result: response.data,
      uuid: response.headers["x-suborbital-requestid"],
    };
  }
}
