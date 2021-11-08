import { Admin } from "./admin";
import { Builder } from "./builder";
import { Exec } from "./exec";

export class Suborbital {
  readonly Admin: Admin;
  readonly Builder: Builder;
  readonly Exec: Exec;

  constructor() {
    this.Admin = new Admin({});
    this.Builder = new Builder({});
    this.Exec = new Exec({});
  }
}
