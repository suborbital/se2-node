import axios, { AxiosInstance } from "axios";
import { Plugin } from "./types/plugin";
import uriencoded from "./util/uriencoded";

interface ExecConfig {
  baseUrl?: string;
  apiKey: string;
}

const EXEC_URI = "https://edge.suborbital.network";

interface ExecutionResult {
  result: ArrayBuffer;
  uuid: string;
}

export class Exec {
  private baseUrl: string;
  private apiKey: string;

  private http: AxiosInstance;

  constructor({ baseUrl = EXEC_URI, apiKey }: ExecConfig) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;

    this.http = axios.create({
      baseURL: this.baseUrl,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
    });
  }

  @uriencoded
  async run(
    { tenant, namespace, name }: Plugin,
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
      `/name/${tenant}/${namespace}/${name}`,
      buffer
    );
    return {
      result: response.data,
      uuid: response.headers["x-suborbital-requestid"],
    };
  }
}
