import axios from "axios";
import { BuildablePlugin, AuthenticatedPlugin } from "./types/plugin";
import uriencoded from "./util/uriencoded";

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

interface Features {
  features: string[];
  languages: { short: string; pretty: string; identifier: string }[];
}

const BUILDER_URI =
  "http://se2-controlplane-service.suborbital.svc.cluster.local:8082";

export class Builder {
  private baseUrl: string;

  constructor({ baseUrl = BUILDER_URI }: BuilderConfig) {
    this.baseUrl = baseUrl;
  }

  @uriencoded
  async build(
    {
      environment,
      userId,
      namespace,
      pluginName,
      language,
      token,
    }: BuildablePlugin,
    body: string
  ) {
    const response = await axios.post(
      `${this.baseUrl}/api/v1/build/${language}/${environment}.${userId}/${namespace}/${pluginName}`,
      body,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data as BuildResponse;
  }

  @uriencoded
  async getDraft({
    environment,
    userId,
    namespace,
    pluginName,
    token,
  }: AuthenticatedPlugin) {
    const response = await axios.get(
      `${this.baseUrl}/api/v1/draft/${environment}.${userId}/${namespace}/${pluginName}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data as EditorState;
  }

  @uriencoded
  async testDraft(
    { environment, userId, namespace, pluginName, token }: AuthenticatedPlugin,
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
      `${this.baseUrl}/api/v1/test/${environment}.${userId}/${namespace}/${pluginName}`,
      buffer,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.result as string;
  }

  @uriencoded
  async deployDraft({
    environment,
    userId,
    namespace,
    pluginName,
    token,
  }: AuthenticatedPlugin) {
    const response = await axios.post(
      `${this.baseUrl}/api/v1/draft/${environment}.${userId}/${namespace}/${pluginName}/promote`,
      null,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data as DeployDraftResponse;
  }

  @uriencoded
  async getTemplate({ pluginName, language }: BuildablePlugin) {
    const response = await axios.get(
      `${this.baseUrl}/api/v2/template/${language}/${pluginName}`
    );
    return response.data.contents as string;
  }

  async getFeatures() {
    const response = await axios.get(`${this.baseUrl}/api/v1/features`);
    return response.data as Features;
  }
}
