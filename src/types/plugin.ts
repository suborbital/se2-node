export interface Plugin {
  tenant: string;
  namespace: string;
  name: string;
}

export interface UserPluginsParams {
  tenant: string;
  namespace?: string;
}

export interface VersionedPlugin extends Plugin {
  ref: string;
}

export interface AuthenticatedPlugin {
  token: string;
}
