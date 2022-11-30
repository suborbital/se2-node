export interface Plugin {
  environment: string;
  userId: string;
  namespace: string;
  name: string;
}

export interface UserPluginsParams {
  environment: string;
  userId: string;
  namespace: string;
}

export interface VersionedPlugin extends Plugin {
  ref: string;
}

export interface AuthenticatedPlugin extends Plugin {
  token: string;
}

export interface BuildablePlugin extends AuthenticatedPlugin {
  language: string;
}
