import axios from "axios";
import { VersionedRunnable } from "./types/runnable";
import uriencoded from "./util/uriencoded";

interface ExecConfig {
  baseUrl?: string;
  envToken: string;
}

const EXEC_URI = "http://scc-atmo-service.suborbital.svc.cluster.local";

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
    { environment, userId, namespace, fnName, version }: VersionedRunnable,
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
      `${this.baseUrl}/${environment}.${userId}/${namespace}/${fnName}/${version}`,
      buffer,
      {
        headers: {
          Authorization: `Bearer ${this.envToken}`,
        },
      }
    );
    return {
      result: response.data,
      uuid: response.headers["x-atmo-requestid"],
    };
  }
}
