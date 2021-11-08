export interface Runnable {
  environment: string;
  customerId: string;
  namespace: string;
  fnName: string;
}

export interface UserFunctionsParams {
  customerId: string;
  namespace: string;
}

export interface VersionedRunnable extends Runnable {
  version: string;
}

export interface AuthenticatedRunnable extends Runnable {
  token: string;
}

export interface BuildableRunnale extends AuthenticatedRunnable {
  language: string;
}
