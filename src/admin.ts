import axios from "axios";
import { Plugin, VersionedPlugin, UserPluginsParams } from "./types/plugin";
import uriencoded from "./util/uriencoded";

interface AdminConfig {
  baseUrl?: string;
}

interface AvailablePlugins {
  plugins: AvailablePlugins[];
}

interface AvailablePlugins {
  name: string;
  namespace: string;
  lang: string;
  version: string;
  draftVersion: string;
  apiVersion: string;
  fqmn: string;
  uri: string;
}

interface ExecutionResults {
  results: ExecutionResult[];
}

interface ExecutionResult {
  uuid: string;
  timestamp: string;
  success: boolean;
  error: {
    code?: number;
    message?: string;
  };
}

const ADMIN_URI =
  "http://se2-controlplane-service.suborbital.svc.cluster.local:8081";

export class Admin {
  private baseUrl: string;

  constructor({ baseUrl = ADMIN_URI }: AdminConfig) {
    this.baseUrl = baseUrl;
  }

  @uriencoded
  async getToken({ environment, userId, namespace, pluginName }: Plugin) {
    const response = await axios.get(
      `${this.baseUrl}/api/v1/token/${environment}.${userId}/${namespace}/${pluginName}`
    );
    return response.data.token as string;
  }

  @uriencoded
  async getPlugins({ environment, userId, namespace }: UserPluginsParams) {
    const response = await axios.get(
      `${this.baseUrl}/api/v2/functions/${environment}.${userId}/${namespace}`
    );
    return response.data as AvailablePlugins;
  }

  @uriencoded
  async getExecutionResultsMetadata({
    environment,
    userId,
    namespace,
    pluginName,
    ref,
  }: VersionedPlugin) {
    const response = await axios.get(
      `${this.baseUrl}/api/v2/results/by-fqmn/${environment}.${userId}/${namespace}/${pluginName}/${ref}`
    );
    return response.data as ExecutionResults;
  }

  @uriencoded
  async getExecutionResultMetadata({ uuid }: { uuid: string }) {
    const response = await axios.get(
      `${this.baseUrl}/api/v2/results/by-uuid/${uuid}`
    );
    return response.data as ExecutionResult;
  }

  @uriencoded
  async getExecutionResult({ uuid }: { uuid: string }) {
    const response = await axios.get(`${this.baseUrl}/api/v2/result/${uuid}`);
    return response.data;
  }
}
