import axios from "axios";
import { Runnable, BuildableRunnable, BuildableTemplate, AuthenticatedRunnable } from "./types/runnable";
import uriencoded from "./util/uriencoded";

interface BuilderConfig {
  baseUrl?: string;
  envToken: string;
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
  "http://scc-controlplane-service.suborbital.svc.cluster.local:8082";

export class Builder {
  private baseUrl: string;
  private envToken: string;

  constructor({ baseUrl = BUILDER_URI, envToken }: BuilderConfig) {
    this.baseUrl = baseUrl;
    this.envToken = envToken;
  }

  @uriencoded
  async getToken({ environment, userId, namespace, fnName }: Runnable) {
    const response = await axios.get(
      `${this.baseUrl}/auth/v2/access/${environment}.${userId}/${namespace}/${fnName}`,
      { headers: { Authorization: `Bearer ${this.envToken}` } }
    );
    return response.data.token as string;
  }

  getEditorUrl({ token, environment, userId, namespace = "default", template = "javascript", fnName }: BuildableTemplate) {
    return "https://editor.suborbital.network/?token="+encodeURIComponent(token)
      + "&builder="+encodeURIComponent(this.baseUrl)
      + "&template="+encodeURIComponent(template)
      + "&ident="+encodeURIComponent(environment+"."+userId)
      + "&namespace="+encodeURIComponent(namespace)
      + "&fn="+encodeURIComponent(fnName)
  }

  @uriencoded
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

  @uriencoded
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

  @uriencoded
  async testDraft(
    { environment, userId, namespace, fnName, token }: AuthenticatedRunnable,
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
      `${this.baseUrl}/api/v1/test/${environment}.${userId}/${namespace}/${fnName}`,
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

  @uriencoded
  async getTemplate({ fnName, language }: BuildableRunnable) {
    const response = await axios.get(
      `${this.baseUrl}/api/v2/template/${language}/${fnName}`
    );
    return response.data.contents as string;
  }

  async getFeatures() {
    const response = await axios.get(`${this.baseUrl}/api/v1/features`);
    return response.data as Features;
  }
}
