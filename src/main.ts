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

export const se2UriConfig: SuborbitalUriConfig = {
  adminUri: "https://controlplane.stg.suborbital.network",
  execUri: "https://edge.stg.suborbital.network",
  builderUri: "https://builder.stg.suborbital.network",
};

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
    this.builder = new Builder({ baseUrl: builderUri, envToken });
  }
}
