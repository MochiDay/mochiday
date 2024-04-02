import { Engine } from "../../types/shared.js";
import { LeverConfig } from "./config/config.js";

export const submitLeverApplication = async (engine: Engine) => {
  console.log("Submitting application...");

  const selector = LeverConfig.selectors.submitApplicationButtonSelector;
  await engine.page.waitForSelector(selector);
  await engine.cursor.click(selector, {
    moveDelay: 80 + Math.random() * 100,
  });

  const screenshot = engine.job.company + "-screenshot.png";

  await Promise.all([
    engine.cursor.click(selector).then(async () => {
      if (engine.debug) await engine.page.screenshot({ path: screenshot });
      console.log("Clicked the submit button");
    }),

    engine.page
      .waitForResponse(
        (response: { url: () => string }) =>
          response.url().endsWith("/thanks") ||
          response.url().includes("already-received"),
        { timeout: LeverConfig.timeouts.submitApplicationTimeout }
      )
      .then((response: any) => {
        if (response.url().includes("already-received")) {
          console.log("ℹ️ Already applied to this job");
          //   TODO: mark db
        } else if (response.url().endsWith("/thanks")) {
          console.log("✅ Successfully submitted application!");
        }
      })
      .catch((e) => {
        console.error(
          "❌ Failed to submit application. Check the screenshot for more info"
        );
        throw e;
      }),
  ]);
};
