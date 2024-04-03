import { createCursor, getRandomPagePoint } from "ghost-cursor";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import UserAgent from "user-agents";
import { goToLinkWithRetry } from "../utils/general.js";
import { JobBoardDriver, Engine } from "../types/shared.js";

export const init = async (
  driver: JobBoardDriver,
  candidate: any,
  job: any,
  debug?: boolean,
  headless: boolean = true
): Promise<Engine> => {
  try {
    // @ts-ignore
    puppeteer.use(StealthPlugin());

    // @ts-ignore
    const browser = await puppeteer.launch({
      headless,
      ignoreHTTPSErrors: true,
      devtools: false,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    const agent = new UserAgent({
      deviceCategory: "desktop",
    });
    const userAgent = agent.random().toString();
    const UA =
      userAgent ||
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36";

    await page.setUserAgent(UA);

    // @ts-ignore
    const ua = await page.evaluate(() => navigator.userAgent);
    console.log(ua);

    await page.setViewport({
      width: 1920 + Math.floor(Math.random() * 100),
      height: 5000 + Math.floor(Math.random() * 100),
    });

    await page.evaluateOnNewDocument(() => {
      // @ts-ignore
      delete navigator.__proto__.webdriver;
    });

    //   Skip images/styles/fonts loading for performance
    await page.setRequestInterception(true);
    page.on("request", (req: any) => {
      if (
        req.resourceType() == "stylesheet" ||
        req.resourceType() == "font" ||
        req.resourceType() == "image"
      ) {
        req.abort();
      } else {
        req.continue();
      }
    });
    const cursor = createCursor(page, await getRandomPagePoint(page));

    await page.setDefaultNavigationTimeout(0);
    await goToLinkWithRetry(page, job.job_url);

    return { page, cursor, browser, candidate, driver, job, debug };
  } catch (error) {
    throw new Error(`❌ Error initializing browser: ${error}`);
  }
};
