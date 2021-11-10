import { Admin } from "./admin";
import { Builder } from "./builder";
import { Exec } from "./exec";

interface SuborbitalConfig {
  adminUri?: string;
  execUri?: string;
  builderUri?: string;
}

export const localConfig: SuborbitalConfig = {
  adminUri: "http://local.suborbital.network:8081",
  execUri: "http://local.suborbital.network:8080",
  builderUri: "http://local.suborbital.network:8082",
};

export class Suborbital {
  readonly admin: Admin;
  readonly exec: Exec;
  readonly builder: Builder;

  constructor(config?: SuborbitalConfig) {
    const { adminUri, execUri, builderUri } = config || {};

    this.admin = new Admin({ baseUrl: adminUri });
    this.exec = new Exec({ baseUrl: execUri });
    this.builder = new Builder({ baseUrl: builderUri });
  }
}
