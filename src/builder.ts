import axios from "axios";
import { BuildableRunnale, AuthenticatedRunnable } from "./types/runnable";

interface BuilderConfig {
  baseUrl?: string;
}

interface BuildResponse {
  succeeded: boolean;
  outputLog: string;
}

export class Builder {
  private baseUrl: string;

  constructor({
    baseUrl = "http://local.suborbital.network:8082",
  }: BuilderConfig) {
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
    }: BuildableRunnale,
    body: string
  ) {
    const response = await axios.post(
      `${this.baseUrl}/api/v1/build/${language}/${environment}.${customerId}/${namespace}/${fnName}`,
      body,
      { headers: { Authorization: `bearer ${token}` } }
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
      { headers: { Authorization: `bearer ${token}` } }
    );
    return response.data as string;
  }

  async getTemplate({ fnName, language }: BuildableRunnale) {
    const response = await axios.get(
      `${this.baseUrl}/api/v2/template/${language}/${fnName}`
    );
    return response.data.contents as string;
  }
}
