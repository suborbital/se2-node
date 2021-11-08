import axios from "axios";
import { Runnable, VersionedRunnable } from "./types/runnable";

interface AdminConfig {
  baseUrl?: string;
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
    return response.data;
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
    return response.data;
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
    return response.data;
  }
}
