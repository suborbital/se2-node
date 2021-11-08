import axios from "axios";
import { Runnable } from "./types/runnable";

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
}
