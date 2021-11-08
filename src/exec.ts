import axios from "axios";
import { VersionedRunnable } from "./types/runnable";

interface ExecConfig {
  baseUrl?: string;
}

export class Exec {
  private baseUrl: string;

  constructor({
    baseUrl = "http://local.suborbital.network:8080",
  }: ExecConfig) {
    this.baseUrl = baseUrl;
  }

  async run(
    { environment, customerId, namespace, fnName, version }: VersionedRunnable,
    input: String | ArrayBuffer | object
  ) {
    let buffer;
    if (typeof input === "string") {
      buffer = new TextEncoder().encode(input).buffer;
    } else if (input instanceof ArrayBuffer) {
      buffer = input;
    } else {
      buffer = new TextEncoder().encode(JSON.stringify(input)).buffer;
    }
    const response = await axios.post(
      `${this.baseUrl}/${environment}.${customerId}/${namespace}/${fnName}/${version}`,
      buffer
    );
    return response.data as ArrayBuffer;
  }
}
