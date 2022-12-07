import axios, { AxiosInstance } from "axios";
import { BuildablePlugin, AuthenticatedPlugin } from "./types/plugin";
import uriencoded from "./util/uriencoded";

interface BuilderConfig {
  baseUrl?: string;
  editorHost?: string;
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

const EDITOR_HOST = "https://editor.suborbital.network/";

export class Builder {
  private baseUrl: string;
  private editorHost: string;

  private http: AxiosInstance;

  constructor({ baseUrl = BUILDER_URI, editorHost = EDITOR_HOST }: BuilderConfig) {
    this.baseUrl = baseUrl;
    this.editorHost = editorHost;

    this.http = axios.create({
      baseURL: this.baseUrl
    });
  }

  getEditorUrl({
    token,
    environment,
    userId,
    namespace = 'default',
    language = 'javascript',
    name,
  }: BuildablePlugin) {
    const identifier = `${environment}.${userId}`;

    const urlParams = new URLSearchParams({
      token,
      builder: this.baseUrl,
      template: language,
      ident: identifier,
      namespace,
      fn: name,
    });

    return `${this.editorHost}?${urlParams}`;
  }

  @uriencoded
  async build(
    { environment, userId, namespace, name, language, token }: BuildablePlugin,
    body: string
  ) {
    const response = await this.http.post(
      `/api/v1/build/${language}/${environment}.${userId}/${namespace}/${name}`,
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
    name,
    token,
  }: AuthenticatedPlugin) {
    const response = await this.http.get(
      `/api/v1/draft/${environment}.${userId}/${namespace}/${name}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data as EditorState;
  }

  @uriencoded
  async testDraft(
    { environment, userId, namespace, name, token }: AuthenticatedPlugin,
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
    const response = await this.http.post(
      `/api/v1/test/${environment}.${userId}/${namespace}/${name}`,
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
    name,
    token,
  }: AuthenticatedPlugin) {
    const response = await this.http.post(
      `/api/v1/draft/${environment}.${userId}/${namespace}/${name}/promote`,
      null,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data as DeployDraftResponse;
  }

  @uriencoded
  async getTemplate({ name, language }: BuildablePlugin) {
    const response = await this.http.get(
      `/api/v2/template/${language}/${name}`
    );
    return response.data.contents as string;
  }

  async getFeatures() {
    const response = await this.http.get(`/api/v1/features`);
    return response.data as Features;
  }
}
