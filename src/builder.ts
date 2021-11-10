import axios from "axios";
import { BuildableRunnable, AuthenticatedRunnable } from "./types/runnable";

interface BuilderConfig {
  baseUrl?: string;
}

interface BuildResponse {
  succeeded: boolean;
  outputLog: string;
}

interface DeployDraftResponse {
  version: string;
}

const BUILDER_URI = "";

export class Builder {
  private baseUrl: string;

  constructor({ baseUrl = BUILDER_URI }: BuilderConfig) {
    this.baseUrl = baseUrl;
  }

  async build(
    {
      environment,
      customerId,
      namespace,
      fnName,
      language,
      token,
    }: BuildableRunnable,
    body: string
  ) {
    const response = await axios.post(
      `${this.baseUrl}/api/v1/build/${language}/${environment}.${customerId}/${namespace}/${fnName}`,
      body,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data as BuildResponse;
  }

  async deployDraft({
    environment,
    customerId,
    namespace,
    fnName,
    token,
  }: AuthenticatedRunnable) {
    const response = await axios.post(
      `${this.baseUrl}/api/v1/draft/${environment}.${customerId}/${namespace}/${fnName}/promote`,
      null,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data as DeployDraftResponse;
  }

  async getTemplate({ fnName, language }: BuildableRunnable) {
    const response = await axios.get(
      `${this.baseUrl}/api/v2/template/${language}/${fnName}`
    );
    return response.data.contents as string;
  }
}
