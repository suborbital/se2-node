import { Suborbital as SuborbitalClient } from "../src/main";

const Suborbital = new SuborbitalClient();

async function e2e() {
  try {
    console.log("Running end-to-end test.\n");

    const params = {
      environment: "dev.suborbital",
      customerId: "bigco",
      namespace: "default",
      fnName: "foo",
    };
    const token = await Suborbital.Admin.getToken(params);
    console.log("Token acquired.");

    const buildParams = { ...params, token, language: "assemblyscript" };

    const template = await Suborbital.Builder.getTemplate(buildParams);
    console.log("Template loaded.");

    console.log("Building function...");
    const buildResult = await Suborbital.Builder.build(buildParams, template);
    if (buildResult.succeeded) {
      console.log("Function built successfully.");
      const deployResult = await Suborbital.Builder.deployDraft(buildParams);

      console.log("Executing function with string input:");
      let result = await Suborbital.Exec.run(
        { ...params, version: deployResult.version },
        "tester!"
      );
      console.log(result);

      console.log("Executing function with JSON object input:");
      result = await Suborbital.Exec.run(
        { ...params, version: deployResult.version },
        { my: { json: "object" } }
      );
      console.log(result);

      console.log("Executing function with ArrayBuffer input:");
      result = await Suborbital.Exec.run(
        { ...params, version: deployResult.version },
        new TextEncoder().encode("UTF-8-encoded text!").buffer
      );
      console.log(result);
    } else {
      console.error("Failed to build function.");
      process.exit(1);
    }
  } catch (e) {
    console.error("NOT OK");
    console.error(e);
    process.exit(1);
  }
}

e2e();
