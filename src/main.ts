import { Admin } from "./admin";
import { Builder } from "./builder";
import { Exec } from "./exec";

interface SuborbitalUriConfig {
  adminUri?: string;
  execUri?: string;
  builderUri?: string;
}

export const localUriConfig: SuborbitalUriConfig = {
  adminUri: "http://local.suborbital.network:8081",
  execUri: "http://local.suborbital.network:8080",
  builderUri: "http://local.suborbital.network:8082",
};

/**
 * Create a URI config for use in Kubernetes deployments.
 * @param builderUri The URI for the builder used to build functions
 */
export const createK8sUriConfig: (string) => SuborbitalUriConfig = (
  builderUri
) => ({
  adminUri: "http://scc-controlplane-service.suborbital.svc.cluster.local:8081",
  execUri: "http://scc-atmo-service.suborbital.svc.cluster.local:80",
  builderUri,
});

export class Suborbital {
  readonly admin: Admin;
  readonly exec: Exec;
  readonly builder: Builder;

  constructor(envToken: string, uriConfig?: SuborbitalUriConfig) {
    if (!envToken) {
      throw new Error("Suborbital environment token is required");
    }

    const { adminUri, execUri, builderUri } = uriConfig || {};

    this.admin = new Admin({ baseUrl: adminUri });
    this.exec = new Exec({ baseUrl: execUri, envToken });
    this.builder = new Builder({ baseUrl: builderUri });
  }
}
