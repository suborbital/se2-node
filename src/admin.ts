import axios from "axios";
import {
  Runnable,
  VersionedRunnable,
  UserFunctionsParams,
} from "./types/runnable";
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
  fqfn: string;
  fqfnURI: string;
}

interface FunctionResults {
  results: FunctionResult[];
}

interface FunctionResult {
  uuid: string;
  timestamp: string;
  response: string;
}

interface FunctionErrors {
  errors: FunctionError[];
}

interface FunctionError {
  uuid: string;
  timestamp: string;
  code: string;
  message: string;
}

const ADMIN_URI =
  "http://scc-controlplane-service.suborbital.svc.cluster.local:8081";

export class Admin {
  private baseUrl: string;

  constructor({ baseUrl = ADMIN_URI }: AdminConfig) {
    this.baseUrl = baseUrl;
  }

  @uriencoded
  async getToken({ environment, userId, namespace, fnName }: Runnable) {
    const response = await axios.get(
      `${this.baseUrl}/api/v1/token/${environment}.${userId}/${namespace}/${fnName}`
    );
    return response.data.token as string;
  }

  @uriencoded
  async getFunctions({ userId, namespace }: UserFunctionsParams) {
    const response = await axios.get(
      `${this.baseUrl}/api/v1/functions/${userId}/${namespace}`
    );
    return response.data as AvailableFunctions;
  }

  @uriencoded
  async getFunctionResults({
    environment,
    userId,
    namespace,
    fnName,
    version,
  }: VersionedRunnable) {
    const response = await axios.get(
      `${this.baseUrl}/api/v1/results/${environment}.${userId}/${namespace}/${fnName}/${version}`
    );
    return response.data as FunctionResults;
  }

  @uriencoded
  async getFunctionErrors({
    environment,
    userId,
    namespace,
    fnName,
    version,
  }: VersionedRunnable) {
    const response = await axios.get(
      `${this.baseUrl}/api/v1/errors/${environment}.${userId}/${namespace}/${fnName}/${version}`
    );
    return response.data as FunctionErrors;
  }
}
