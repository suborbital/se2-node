import axios from "axios";
import { BuildableRunnable, AuthenticatedRunnable } from "./types/runnable";

interface BuilderConfig {
  baseUrl?: string;
}

interface BuildResponse {
  succeeded: boolean;
  outputLog: string;
}

interface TestPayload {
  name: string;
  description: string;
  payload: string;
}

interface EditorState {
  lang: string;
  contents: string;
  tests: TestPayload[];
}

interface DeployDraftResponse {
  version: string;
}

const BUILDER_URI =
  "http://scc-controlplane-service.suborbital.svc.cluster.local:8082";

export class Builder {
  private baseUrl: string;

  constructor({ baseUrl = BUILDER_URI }: BuilderConfig) {
    this.baseUrl = baseUrl;
  }

  async build(
    {
      environment,
      userId,
      namespace,
      fnName,
      language,
      token,
    }: BuildableRunnable,
    body: string
  ) {
    const response = await axios.post(
      `${this.baseUrl}/api/v1/build/${language}/${environment}.${userId}/${namespace}/${fnName}`,
      body,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data as BuildResponse;
  }

  async getDraft({
    environment,
    userId,
    namespace,
    fnName,
    token,
  }: AuthenticatedRunnable) {
    const response = await axios.get(
      `${this.baseUrl}/api/v1/draft/${environment}.${userId}/${namespace}/${fnName}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data as EditorState;
  }

  async deployDraft({
    environment,
    userId,
    namespace,
    fnName,
    token,
  }: AuthenticatedRunnable) {
    const response = await axios.post(
      `${this.baseUrl}/api/v1/draft/${environment}.${userId}/${namespace}/${fnName}/promote`,
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
