import axios, { AxiosInstance } from "axios";
import { AuthenticatedPlugin } from "./types/plugin";
import uriencoded from "./util/uriencoded";

interface BuilderConfig {
  baseUrl?: string;
  editorHost?: string;
  apiKey: string;
}

interface BuildResponse {
  succeeded: boolean;
  outputLog: string;
}

interface CreateDraftParams extends AuthenticatedPlugin {
  template: string;
}

interface GetEditorUrlParams extends AuthenticatedPlugin {
  template: string;
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
  ref: string;
}

interface Template {
  name: string;
}

interface Features {
  features: string[];
  languages: { short: string; pretty: string; identifier: string }[];
}

const BUILDER_URI = "https://api.suborbital.network";

const EDITOR_HOST = "https://editor.suborbital.network/";

export class Builder {
  private baseUrl: string;
  private editorHost: string;
  private apiKey: string;

  private http: AxiosInstance;

  constructor({
    baseUrl = BUILDER_URI,
    editorHost = EDITOR_HOST,
    apiKey,
  }: BuilderConfig) {
    this.baseUrl = baseUrl;
    this.editorHost = editorHost;
    this.apiKey = apiKey;

    this.http = axios.create({
      baseURL: this.baseUrl,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
    });
  }

  getEditorUrl({ token, template }: GetEditorUrlParams) {
    const urlParams = new URLSearchParams({
      token,
      builder: this.baseUrl,
      template,
    });

    return `${this.editorHost}?${urlParams}`;
  }

  @uriencoded
  async build({ token }: AuthenticatedPlugin, body: string) {
    const response = await this.http.post(`/builder/v1/draft/build`, body, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data as BuildResponse;
  }

  @uriencoded
  async createDraft({ token, template }: CreateDraftParams) {
    const response = await this.http.post(
      `/builder/v1/draft`,
      { template },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data as EditorState;
  }

  @uriencoded
  async getDraft({ token }: AuthenticatedPlugin) {
    const response = await this.http.get(`/builder/v1/draft`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data as EditorState;
  }

  @uriencoded
  async testDraft(
    { token }: AuthenticatedPlugin,
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
    const response = await this.http.post(`/builder/v1/draft/test`, buffer, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.result as string;
  }

  @uriencoded
  async deployDraft({ token }: AuthenticatedPlugin) {
    const response = await this.http.post(`/builder/v1/draft/deploy`, null, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data as DeployDraftResponse;
  }

  @uriencoded
  async getTemplate({ name }: Template) {
    const response = await this.http.get(`/template/v1/template/${name}`);
    return response.data.contents as string;
  }

  async getFeatures() {
    const response = await this.http.get(`/api/v1/features`);
    return response.data as Features;
  }
}
