import { DownloaderHelper } from "node-downloader-helper";
import { DirName } from "./general.js";

import fs from "fs";
import { join } from "path";

export async function downloadResume(candidate: any) {
  console.log("Downloading resume...");

  const url = candidate.resume_link;
  const filename = url.split("/").pop();
  const userResumeDirectory = join(DirName, candidate.id);
  const filePath = join(userResumeDirectory, filename);

  if (!fs.existsSync(userResumeDirectory)) {
    fs.mkdirSync(userResumeDirectory, { recursive: true });
  }

  const dl = new DownloaderHelper(url, userResumeDirectory);

  dl.on("end", () => console.log("✅ Resume downloaded"));
  dl.on("error", (err) => console.log("❌ Resume download failed", err));
  await dl.start().catch((err) => {
    throw err;
  });

  return filePath;
}
