import { Engine } from "../../types/shared.js";
import { sleep } from "../../utils/general.js";
import { LeverConfig } from "./config/config.js";

export const submitLeverApplication = async (engine: Engine) => {
  console.log("Submitting application...");

  // scroll to the bottom of the page
  await engine.page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });
  await sleep(400 + Math.random() * 1200);
  const selector = LeverConfig.selectors.submitApplicationButtonSelector;
  await engine.page.waitForSelector(selector);

  // await engine.cursor.click(selector);
  const screenshot = engine.job.company + "-screenshot.png";

  await Promise.all([
    engine.cursor.click(selector).then(async () => {
      if (engine.debug) {
        await sleep(2000);
        await engine.page.screenshot({ path: screenshot });
      }
    }),
    engine.page
      .waitForResponse(
        (response: { url: () => string }) =>
          response.url().endsWith("/thanks") ||
          response.url().includes("already-received"),
        { timeout: LeverConfig.timeouts.submitApplicationTimeout }
      )
      .then(async (response: any) => {
        if (response.url().includes("already-received")) {
          console.log("ℹ️ Already applied to this job");
          //   TODO: mark db
        } else if (response.url().endsWith("/thanks")) {
          console.log("✅ Successfully submitted application!");
        }
        await sleep(500 + Math.random() * 500);
      })
      .catch((e) => {
        console.error(
          "❌ Failed to submit application. Check the screenshot for more info"
        );
        throw e;
      }),
  ]);
};
