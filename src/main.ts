import { Admin } from "./admin";
import { Builder } from "./builder";
import { Exec } from "./exec";

export class Suborbital {
  readonly admin: Admin;
  readonly builder: Builder;
  readonly exec: Exec;

  constructor() {
    this.admin = new Admin({});
    this.builder = new Builder({});
    this.exec = new Exec({});
  }
}
