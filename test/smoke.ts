import { Suborbital, localConfig } from "../src/main";

const suborbital = new Suborbital(localConfig);

async function e2e() {
  try {
    console.log("Running end-to-end test.\n");

    const params = {
      environment: "dev.suborbital",
      customerId: "bigco",
      namespace: "default",
      fnName: "foo",
    };
    const token = await suborbital.admin.getToken(params);
    console.log("Token acquired.");

    const buildParams = { ...params, token, language: "assemblyscript" };

    const template = await suborbital.builder.getTemplate(buildParams);
    console.log("Template loaded.");

    console.log("Building function...");
    const buildResult = await suborbital.builder.build(buildParams, template);
    if (buildResult.succeeded) {
      console.log("Function built successfully.");

      const deployResult = await suborbital.builder.deployDraft(buildParams);
      console.log("Deployed version", deployResult.version);

      console.log("Executing function with string input:");
      let result = await suborbital.exec.run(
        { ...params, version: deployResult.version },
        "tester!"
      );
      console.log(result);

      console.log("Executing function with JSON object input:");
      result = await suborbital.exec.run(
        { ...params, version: deployResult.version },
        { my: { json: "object" } }
      );
      console.log(result);

      console.log("Executing function with ArrayBuffer input:");
      result = await suborbital.exec.run(
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
