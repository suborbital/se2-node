import { Admin } from "./admin";
import { Builder } from "./builder";
import { Exec } from "./exec";

interface SuborbitalUriConfig {
  apiUri?: string;
  execUri?: string;
  builderUri?: string;
}

export const localUriConfig: SuborbitalUriConfig = {
  apiUri: "http://local.suborbital.network:8081",
  execUri: "http://local.suborbital.network:8080",
  builderUri: "http://local.suborbital.network:8082",
};

export class Suborbital {
  readonly admin: Admin;
  readonly exec: Exec;
  readonly builder: Builder;

  constructor(apiKey: string, uriConfig?: SuborbitalUriConfig) {
    if (!apiKey) {
      throw new Error("An API key is required");
    }

    const { apiUri, execUri, builderUri } = uriConfig || {};

    this.admin = new Admin({ baseUrl: apiUri, apiKey });
    this.exec = new Exec({ baseUrl: execUri, apiKey });
    this.builder = new Builder({ baseUrl: builderUri, apiKey });
  }
}
