import { Suborbital } from "../src/main";

const config = {
  apiUri: "https://stg.api.suborbital.network",
  execUri: "https://stg.edge.suborbital.network",
  builderUri: "https://stg.api.suborbital.network",
};

const suborbital = new Suborbital(process.env.SE2_ENV_TOKEN, config);

async function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function e2e() {
  try {
    console.log("Running end-to-end test.\n");

    console.log("Importing templates...");
    await suborbital.admin.importGitHubTemplates({
      repo: "suborbital/sdk",
      ref: "main",
      path: "templates",
    });

    console.log("Listing templates...");
    const templates = await suborbital.admin.getTemplates();
    console.log(templates);

    console.log("Listing features...");
    const features = await suborbital.builder.getFeatures();
    console.log(features);

    console.log("Creating tenant...");
    await suborbital.admin.createTenant({ tenant: "bigco" });

    const params = {
      tenant: "bigco",
      namespace: "default",
      name: "foo",
    };
    console.log("Creating session...");
    const token = await suborbital.admin.createSession(params);
    console.log("Token acquired.");

    const buildParams = { ...params, token, template: "javascript" };
    console.log("Creating draft...");
    await suborbital.builder.createDraft(buildParams);

    const draft = await suborbital.builder.getDraft(buildParams);
    console.log("Draft loaded.\n", draft.contents);

    console.log("Building function...");
    const buildResult = await suborbital.builder.build(
      buildParams,
      draft.contents + ";console.log('suspicious')   "
    );
    if (buildResult.succeeded) {
      console.log("Function built successfully.");

      const testResult = await suborbital.builder.testDraft(
        buildParams,
        "tester"
      );
      console.log("Function test result:", testResult);
      if (testResult.includes("Hello, tester")) {
        console.log("Function tested successfuly");
      } else {
        throw new Error("Function test failed");
      }

      const deployResult = await suborbital.builder.deployDraft(buildParams);
      console.log("Deployed version", deployResult.ref);

      const allFunctions = await suborbital.admin.getPlugins(buildParams);
      console.log("All functions:", allFunctions);

      await sleep(3000);

      console.log("Executing function with string input by fqmn:");
      let result = await suborbital.exec.run(params, "tester!");
      console.log(result.result);

      console.log("Executing function with JSON object input by fqmn:");
      result = await suborbital.exec.run(params, {
        my: { json: "object" },
      });
      console.log(result.result);

      console.log("Executing function with ArrayBuffer input by fqmn:");
      result = await suborbital.exec.run(
        params,
        new TextEncoder().encode("UTF-8-encoded text!").buffer
      );
      console.log(result.result);

      console.log("Removing tenant...");
      await suborbital.admin.deleteTenant({ tenant: "bigco" });

      console.log("Success!");
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
