import { createCursor, getRandomPagePoint } from "ghost-cursor";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
// import PluginProxy from "puppeteer-extra-plugin-proxy";
import UserAgent from "user-agents";
import { goToLinkWithRetry } from "../utils/general.js";
import { JobBoardDriver, Engine } from "../types/shared.js";
import { Candidate, Job } from "../types/supabase.js";

export const init = async (
  driver: JobBoardDriver,
  candidate: Candidate,
  job: Job,
  debug?: boolean,
  headless = true
): Promise<Engine> => {
  try {
    puppeteer.use(StealthPlugin());
    // puppeteer.use(
    //   PluginProxy({
    //     address: "p.webshare.io",
    //     port: 5868,
    //     credentials: {
    //       username: "bwltfpil",
    //       password: "bdxe9bnlaynr",
    //     },
    //   })
    // );

    const browser = await puppeteer.launch({
      headless,
      ignoreHTTPSErrors: true,
      args: [
        "--no-sandbox",
        "--incognito",
        "--disable-setuid-sandbox",
        "--proxy-server=p.webshare.io:80",
      ],
    });

    const page = await browser.newPage();
    await page.authenticate({
      username: "bwltfpil-rotate",
      password: "bdxe9bnlaynr",
    });
    const agent = new UserAgent({
      deviceCategory: "desktop",
    });
    const userAgent = agent.random().toString();
    const UA =
      userAgent ||
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36";

    await page.setUserAgent(UA);

    const ua = await page.evaluate(() => navigator.userAgent);
    console.log(ua);

    await page.setViewport({
      width: 1920 + Math.floor(Math.random() * 100),
      height: 5000 + Math.floor(Math.random() * 100),
    });

    await page.evaluateOnNewDocument(() => {
      // @ts-expect-error Property 'webdriver' does not exist on type 'Navigator'
      delete navigator.__proto__.webdriver;
    });

    // //   Skip images/styles/fonts loading for performance
    // await page.setRequestInterception(true);
    // page.on("request", (req: any) => {
    //   if (
    //     req.resourceType() == "stylesheet" ||
    //     req.resourceType() == "font" ||
    //     req.resourceType() == "image"
    //   ) {
    //     req.abort();
    //   } else {
    //     req.continue();
    //   }
    // });

    const cursor = createCursor(page, await getRandomPagePoint(page), true);

    await page.setDefaultNavigationTimeout(0);
    await goToLinkWithRetry(page, job.job_url);

    return { page, cursor, browser, candidate, driver, job, debug };
  } catch (error) {
    throw new Error(`❌ Error initializing browser: ${error}`);
  }
};
