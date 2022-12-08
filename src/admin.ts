import axios, { AxiosInstance, AxiosResponse } from "axios";
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

interface Tenant {
  authorized_party: string;
  organization: string;
  environment: string;
  tenant: string;
}

interface TenantAPIParams {
  envToken: string;
}

interface TenantAPIRequestParams extends TenantAPIParams {
  environment: string;
}

interface TenantAPITenantParams extends TenantAPIRequestParams {
  tenant: string;
}
interface TenantAPITenantChangeParams extends TenantAPITenantParams {
  description?: string;
}

const ADMIN_URI =
  "http://se2-controlplane-service.suborbital.svc.cluster.local:8081";

export class Admin {
  private baseUrl: string;

  private http: AxiosInstance;

  constructor({ baseUrl = ADMIN_URI }: AdminConfig) {
    this.baseUrl = baseUrl;

    this.http = axios.create({
      baseURL: this.baseUrl,
    });
  }

  @uriencoded
  async getToken({ environment, userId, namespace, name }: Plugin) {
    const response = await this.http.get(
      `/api/v1/token/${environment}.${userId}/${namespace}/${name}`
    );
    return response.data.token as string;
  }

  @uriencoded
  async getPlugins({ environment, userId, namespace }: UserPluginsParams) {
    const response = await this.http.get(
      `/api/v2/functions/${environment}.${userId}/${namespace}`
    );
    return response.data as AvailablePlugins;
  }

  @uriencoded
  async getExecutionResultsMetadata({
    environment,
    userId,
    namespace,
    name,
    ref,
  }: VersionedPlugin) {
    const response = await this.http.get(
      `/api/v2/results/by-fqmn/${environment}.${userId}/${namespace}/${name}/${ref}`
    );
    return response.data as ExecutionResults;
  }

  @uriencoded
  async getExecutionResultMetadata({ uuid }: { uuid: string }) {
    const response = await this.http.get(`/api/v2/results/by-uuid/${uuid}`);
    return response.data as ExecutionResult;
  }

  @uriencoded
  async getExecutionResult({ uuid }: { uuid: string }) {
    const response = await this.http.get(`/api/v2/result/${uuid}`);
    return response.data;
  }

  async listTenants({ environment, envToken }: TenantAPIRequestParams) {
    let tenants;
    try {
      tenants = await this.http.get(
        `https://api.stg.suborbital.network/api/v1/environment/${encodeURIComponent(
          environment
        )}`,
        {
          headers: {
            Authorization: `Bearer ${envToken}`,
          },
        }
      );

      return (tenants.data.tenants ?? []) as Tenant[];
    } catch (error) {
      throw error;
    }
  }

  async getTenant({
    environment,
    tenant,
    envToken,
  }: TenantAPITenantParams): Promise<Tenant> {
    let tenantRes: AxiosResponse;

    try {
      const id = `${environment}.${tenant}`;

      tenantRes = await this.http.get(
        `https://api.stg.suborbital.network/api/v1/tenant/${encodeURIComponent(
          id
        )}`,
        {
          headers: {
            Authorization: `Bearer ${envToken}`,
          },
        }
      );

      return tenantRes.data as Tenant;
    } catch (error) {
      throw error;
    }
  }

  async createTenant(
    { environment, tenant, description, envToken }: TenantAPITenantChangeParams,
    ignoreExisting = true
  ): Promise<Tenant> {
    let tenantRes: AxiosResponse;

    try {
      const id = `${environment}.${tenant}`;

      tenantRes = await this.http.post(
        `https://api.stg.suborbital.network/api/v1/tenant/${encodeURIComponent(
          id
        )}`,
        description ? { description } : undefined,
        {
          headers: {
            Authorization: `Bearer ${envToken}`,
          },
        }
      );

      return tenantRes.data as Tenant;
    } catch (createError) {
      const { response } = createError;

      // By default, if a tenant with this id already exists, the function still succeeds
      if (ignoreExisting) {
        try {
          return this.getTenant({ environment, tenant, envToken });
        } catch (getError) {
          // Return original error
        }
      }

      // Error will be returned when getTenant fails or IgnoreExisting is set to false
      throw createError;
    }
  }
}
