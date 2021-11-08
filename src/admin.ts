import axios from "axios";
import { Runnable, VersionedRunnable } from "./types/runnable";

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

export class Admin {
  private baseUrl: string;

  constructor({
    baseUrl = "http://local.suborbital.network:8081/api/v1",
  }: AdminConfig) {
    this.baseUrl = baseUrl;
  }

  async getToken({ environment, customerId, namespace, fnName }: Runnable) {
    const response = await axios.get(
      `${this.baseUrl}/token/${environment}.${customerId}/${namespace}/${fnName}`
    );
    return response.data.token as string;
  }

  async getAvailableFunctions({ customerId, namespace }: Runnable) {
    const response = await axios.get(
      `${this.baseUrl}/functions/${customerId}/${namespace}`
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
      `${this.baseUrl}/results/${environment}.${customerId}/${namespace}/${fnName}/${version}`
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
      `${this.baseUrl}/errors/${environment}.${customerId}/${namespace}/${fnName}/${version}`
    );
    return response.data as FunctionErrors;
  }
}
