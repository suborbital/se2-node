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
    input: ArrayBuffer
  ) {
    const response = await axios.post(
      `${this.baseUrl}/${environment}.${customerId}/${namespace}/${fnName}/${version}`,
      input
    );
    return response.data as ArrayBuffer;
  }
}
