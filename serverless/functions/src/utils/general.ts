import type { Page } from "puppeteer";

// export const DirName = resolve(dirname(fileURLToPath(import.meta.url)), "..");

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const checkKeywordExist = (text: string, keywords: string[]) => {
  return keywords.some((keyword) =>
    text.toLowerCase().includes(keyword.toLowerCase())
  );
};

export async function goToLinkWithRetry(
  page: Page,
  link: string,
  maxRetries = 3,
  timeout = 5000
) {
  let retryCount = 0;
  while (retryCount < maxRetries) {
    try {
      await page.goto(link, { timeout });
      // await page.waitForNavigation();

      // If page.goto() succeeds, exit the loop
      return;
    } catch (error) {
      // Handle timeout error
      console.log(
        `ℹ️ Timeout occurred, retrying (${retryCount + 1}/${maxRetries})`
      );
      retryCount++;
      // Reload the page
      await page.reload({ waitUntil: "domcontentloaded", timeout });
    }
  }
  // If max retries exceeded, throw an error
  throw new Error(`❌ Failed to load ${link} after ${maxRetries} attempts.`);
}
