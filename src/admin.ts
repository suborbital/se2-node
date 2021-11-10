import axios from "axios";
import {
  Runnable,
  VersionedRunnable,
  UserFunctionsParams,
} from "./types/runnable";

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

  async getToken({ environment, customerId, namespace, fnName }: Runnable) {
    const response = await axios.get(
      `${this.baseUrl}/api/v1/token/${environment}.${customerId}/${namespace}/${fnName}`
    );
    return response.data.token as string;
  }

  async getFunctions({ customerId, namespace }: UserFunctionsParams) {
    const response = await axios.get(
      `${this.baseUrl}/api/v1/functions/${customerId}/${namespace}`
    );
    return response.data as AvailableFunctions;
  }

  async getFunctionResults({
    environment,
    customerId,
    namespace,
    fnName,
    version,
  }: VersionedRunnable) {
    const response = await axios.get(
      `${this.baseUrl}/api/v1/results/${environment}.${customerId}/${namespace}/${fnName}/${version}`
    );
    return response.data as FunctionResults;
  }

  async getFunctionErrors({
    environment,
    customerId,
    namespace,
    fnName,
    version,
  }: VersionedRunnable) {
    const response = await axios.get(
      `${this.baseUrl}/api/v1/errors/${environment}.${customerId}/${namespace}/${fnName}/${version}`
    );
    return response.data as FunctionErrors;
  }
}
