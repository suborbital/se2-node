import axios, { AxiosInstance, AxiosResponse } from "axios";
import { Plugin, UserPluginsParams } from "./types/plugin";
import uriencoded from "./util/uriencoded";

interface AdminConfig {
  baseUrl?: string;
  apiKey: string;
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

interface Tenant {
  authorized_party: string;
  organization: string;
  environment: string;
  id: string;
}

interface TenantAPIParams {
  tenant: string;
}

interface TemplateMetadataInfo {
  name: string;
  lang: string;
  api_version: string;
}

interface Templates {
  templates: TemplateMetadataInfo[];
}

interface GetTemplateParams {
  name: string;
}

interface importGitHubTemplatesParams {
  repo: string;
  ref: string;
  path?: string;
}

const ADMIN_URI = "https://api.suborbital.network";

export class Admin {
  private baseUrl: string;
  private apiKey: string;

  // Control plane requests
  private http: AxiosInstance;

  constructor({ baseUrl = ADMIN_URI, apiKey }: AdminConfig) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;

    this.http = axios.create({
      baseURL: this.baseUrl,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
    });
  }

  @uriencoded
  async createSession({ tenant, namespace, name }: Plugin) {
    const response = await this.http.post(
      `/environment/v1/tenant/${tenant}/session`,
      {
        namespace,
        fn: name,
      }
    );
    return response.data.token as string;
  }

  @uriencoded
  async getPlugins({ tenant, namespace }: UserPluginsParams) {
    const response = await this.http.get(
      `/environment/v1/tenant/${tenant}/plugins`,
      { params: { namespace } }
    );
    return response.data as AvailablePlugins;
  }

  async listTenants() {
    let tenants;
    try {
      tenants = await this.http.get(`/environment/v1/tenant`);

      return (tenants.data.tenants ?? []) as Tenant[];
    } catch (error) {
      throw error;
    }
  }

  async getTenant({ tenant }: TenantAPIParams): Promise<Tenant> {
    let tenantRes: AxiosResponse;

    try {
      tenantRes = await this.http.get(
        `/environment/v1/tenant/${encodeURIComponent(tenant)}`
      );

      return tenantRes.data as Tenant;
    } catch (error) {
      throw error;
    }
  }

  async createTenant(
    { tenant }: TenantAPIParams,
    ignoreExisting = true
  ): Promise<Tenant> {
    let tenantRes: AxiosResponse;

    try {
      tenantRes = await this.http.post(
        `/environment/v1/tenant/${encodeURIComponent(tenant)}`
      );

      return tenantRes.data as Tenant;
    } catch (createError) {
      // By default, if a tenant with this id already exists, the function still succeeds
      if (ignoreExisting) {
        try {
          return this.getTenant({ tenant });
        } catch (getError) {
          // Return original error
        }
      }

      // Error will be returned when getTenant fails or IgnoreExisting is set to false
      throw createError;
    }
  }

  async deleteTenant({ tenant }: TenantAPIParams): Promise<void> {
    try {
      await this.http.delete(
        `/environment/v1/tenant/${encodeURIComponent(tenant)}`
      );

      return;
    } catch (error) {
      throw error;
    }
  }

  async getTemplates(): Promise<Templates> {
    let templatesRes: AxiosResponse;
    try {
      templatesRes = await this.http.get(`/template/v1`);

      return templatesRes.data as Templates;
    } catch (error) {
      throw error;
    }
  }

  @uriencoded
  async getTemplate({
    name,
  }: GetTemplateParams): Promise<TemplateMetadataInfo> {
    let templatesRes: AxiosResponse;
    try {
      templatesRes = await this.http.get(`/template/v1/${name}`);

      return templatesRes.data as TemplateMetadataInfo;
    } catch (error) {
      throw error;
    }
  }

  async importGitHubTemplates({
    repo,
    ref,
    path = "",
  }: importGitHubTemplatesParams): Promise<void> {
    try {
      await this.http.post(`/template/v1/import`, {
        src: "git",
        params: {
          repo,
          ref,
          path,
        },
      });

      return;
    } catch (error) {
      throw error;
    }
  }
}
