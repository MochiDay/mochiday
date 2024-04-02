import { getAllJobs, getUserDetails } from "../database/queries.js";
import { sleep } from "./utils/general.js";
import { init } from "./drivers/init.js";

import { JobBoardDriver } from "./types/shared.js";
import { apply } from "./drivers/apply.js";

async function details(user_id: string) {
  const userDetails = await getUserDetails(user_id);
  if (userDetails.error) {
    console.error("Error fetching user details");
    return;
  }

  const candidate = userDetails.data[0];
  return candidate;
}

export async function checkBot() {
  const engine = await init(JobBoardDriver.LEVER, {}, {}, true);

  await engine.page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36"
  );
  await engine.page.setViewport({
    width: 1920 + Math.floor(Math.random() * 100),
    height: 3000 + Math.floor(Math.random() * 100),
  });
  await engine.page.setJavaScriptEnabled(false);

  await engine.page.goto("https://pixelscan.net/", {
    waitUntil: "domcontentloaded",
  });

  await new Promise((resolve) => setTimeout(resolve, 1000 * 7));
  await engine.page.screenshot({ path: "pixelscan.png" });

  await engine.page.goto("https://fingerprintjs.github.io/BotD/main/", {
    waitUntil: "domcontentloaded",
  });
  await new Promise((resolve) => setTimeout(resolve, 1000 * 3));

  await engine.page.screenshot({ path: "fingerprint.png" });

  await engine.page.goto(
    "https://prescience-data.github.io/execution-monitor.html",
    {
      waitUntil: "domcontentloaded",
    }
  );
  await new Promise((resolve) => setTimeout(resolve, 1000 * 3));
  await engine.page.screenshot({ path: "execution-monior.png" });

  await engine.page.goto("https://www.browserscan.net/en/bot-detection", {
    waitUntil: "domcontentloaded",
  });
  await engine.page.screenshot({ path: "browserscan.png" });
  await engine.browser.close();
}

export async function main() {
  const candidate = await details("5");
  let jobs = await getAllJobs();
  if (!jobs.data) return;

  for (const job of jobs.data.slice(0, 4)) {
    let engine;
    try {
      engine = await init(JobBoardDriver.LEVER, candidate, job, true);
      await apply(engine);
    } catch (error) {
      console.error(error);
    }
    await engine?.browser.close();
    await sleep(100 + Math.floor(Math.random() * 800));
  }
}

// checkBot();
main();
