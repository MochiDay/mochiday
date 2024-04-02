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
  let filePath;
  if (input === null) {
    throw new Error("Resume uploader not found on page");
  } else {
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
    .catch(() => {
      throw new Error("❌ Failed to upload resume to Lever");
    });
  return filePath;
};
