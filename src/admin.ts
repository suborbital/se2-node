import axios from "axios";
import { Module, VersionedModule, UserFunctionsParams } from "./types/module";
import uriencoded from "./util/uriencoded";

interface AdminConfig {
  baseUrl?: string;
}

interface AvailableFunctions {
  functions: AvailableFunction[];
}

interface AvailableFunction {
  name: string;
  namespace: string;
  lang: string;
  version: string;
  draftVersion: string;
  apiVersion: string;
  fqmn: string;
  uri: string;
}

interface FunctionResults {
  results: FunctionResult[];
}

interface FunctionResult {
  uuid: string;
  timestamp: string;
  success: boolean;
  error: {
    code?: number;
    message?: string;
  };
}

const ADMIN_URI =
  "http://scc-controlplane-service.suborbital.svc.cluster.local:8081";

export class Admin {
  private baseUrl: string;

  constructor({ baseUrl = ADMIN_URI }: AdminConfig) {
    this.baseUrl = baseUrl;
  }

  @uriencoded
  async getToken({ environment, userId, namespace, fnName }: Module) {
    const response = await axios.get(
      `${this.baseUrl}/api/v1/token/${environment}.${userId}/${namespace}/${fnName}`
    );
    return response.data.token as string;
  }

  @uriencoded
  async getFunctions({ environment, userId, namespace }: UserFunctionsParams) {
    const response = await axios.get(
      `${this.baseUrl}/api/v2/functions/${environment}.${userId}/${namespace}`
    );
    return response.data as AvailableFunctions;
  }

  @uriencoded
  async getFunctionResultsMetadata({
    environment,
    userId,
    namespace,
    fnName,
    ref,
  }: VersionedModule) {
    const response = await axios.get(
      `${this.baseUrl}/api/v2/results/by-fqmn/${environment}.${userId}/${namespace}/${fnName}/${ref}`
    );
    return response.data as FunctionResults;
  }

  @uriencoded
  async getFunctionResultMetadata({ uuid }: { uuid: string }) {
    const response = await axios.get(
      `${this.baseUrl}/api/v2/results/by-uuid/${uuid}`
    );
    return response.data as FunctionResult;
  }

  @uriencoded
  async getFunctionResult({ uuid }: { uuid: string }) {
    const response = await axios.get(`${this.baseUrl}/api/v2/result/${uuid}`);
    return response.data;
  }
}
