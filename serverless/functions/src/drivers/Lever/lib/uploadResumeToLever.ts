import { Engine } from "../../../types/shared.js";
import { LeverConfig } from "../config/config.js";

export const uploadResumeToLever = async (
  engine: Engine,
  resumePath: string
) => {
  console.log("Uploading resume to Lever...");
  const input = await engine.page.$(
    LeverConfig.selectors.resumeUploaderSelector
  );
  if (input === null) {
    throw new Error("Resume uploader not found on page");
  } else {
    console.log(resumePath);
    // @ts-expect-error Property 'uploadFile' does not exist on type 'ElementHandle<Element>'
    await input.uploadFile(resumePath);
  }
  const timeout = 10_000;
  await engine.page
    .waitForFunction(
      `document.querySelector('.resume-upload-failure').style.display === 'inline' || document.querySelector('.resume-upload-success').style.display === 'inline'`,
      { timeout }
    )
    .then(async () => {
      console.log("✅ Resume uploaded to Lever");
    })
    .catch(async (e) => {
      console.error(e);
      await engine.page.screenshot({ path: "error.png" });
      throw new Error("❌ Failed to upload resume to Lever");
    });
};
