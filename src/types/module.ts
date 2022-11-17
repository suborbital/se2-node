export interface Module {
  environment: string;
  userId: string;
  namespace: string;
  fnName: string;
}

export interface UserFunctionsParams {
  environment: string;
  userId: string;
  namespace: string;
}

export interface VersionedModule extends Module {
  ref: string;
}

export interface AuthenticatedModule extends Module {
  token: string;
}

export interface BuildableModule extends AuthenticatedModule {
  language: string;
}
