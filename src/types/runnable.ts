export interface Runnable {
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

export interface VersionedRunnable extends Runnable {
  version: string;
}

export interface AuthenticatedRunnable extends Runnable {
  token: string;
}

export interface BuildableRunnable extends AuthenticatedRunnable {
  language: string;
}

export interface BuildableTemplate extends AuthenticatedRunnable {
  template: string;
}
