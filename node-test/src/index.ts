import { getAllJobs, getUserDetails } from "../database/queries.js";
import { sleep } from "./utils/general.js";
import { init } from "./drivers/init.js";

import { JobBoardDriver } from "./types/shared.js";
import { apply } from "./drivers/apply.js";

// Lever Process:
// 1) Upload resume,
// 2) Fill basic details,
// 3) Answer custom questions,
// 4) Submit application

// To fill each basic input, we need to
// 0) check if the input field exists and we have database value for it,
// 1) move the mouse to the input field, - this we need to get the
//    bounding rect and move the mouse to a random place inside of the
//    bounding rect. the elements need to be visible, so our initial
//    screen size needs to be large in height
// 2) click the input field, - click quickly three times but not
//    instantly three times. just add some random delay between the
//    clicks
// 3) remove the text in the input field,
// 4) type the input field
// 5) wait for a few seconds random
// 6) scroll the page down a bit random
// once all filled, we need to scroll down more
const basicInputs = [
  'input[name="name"]',
  'input[name="email"]',
  'input[name="phone"]',
  'input[name="org"]',
  'input[name="urls[LinkedIn]',
  'input[name="urls[GitHub]',
  'input[name="urls[Twitter]',
  'input[name="urls[Portfolio]',
  'input[name="urls[Other]',
];

// TODO : Add hispanic?, disability, pronouns
// TODO : download and upload resume from storage
async function fillBasics(page: any, cursor: any, candidate: any) {
  // Fill the form
  console.log("Filling in the details");

  if (candidate.first_name && candidate.last_name) {
    const inputValue = await page.$eval(
      'input[name="name"]',
      (el: any) => el.value
    );
    await cursor.click('input[name="name"]');
    await cursor.click('input[name="name"]', {
      delay: 100 + Math.floor(Math.random() * 100),
    });
    await cursor.click('input[name="name"]', {
      delay: 100 + Math.floor(Math.random() * 100),
    });
    for (let i = 0; i < inputValue.length; i++) {
      await page.keyboard.press("Backspace", {
        delay: 100 + Math.floor(Math.random() * 100),
      });
    }

    page.type(
      'input[name="name"]',
      candidate.first_name + " " + candidate.last_name
    );
    await new Promise((resolve) =>
      setTimeout(resolve, 600 + Math.floor(Math.random() * 1000))
    );
  }

  // scroll down the page
  await page.evaluate(() => {
    window.scrollBy(0, 100);
  });

  //   move the cursor randomly
  await cursor.move('input[name="email"]', {
    delay: 100 + Math.floor(Math.random() * 100),
  });

  if (candidate.email) {
    const inputValue = await page.$eval(
      'input[name="email"]',
      (el: any) => el.value
    );
    await cursor.click('input[name="email"]');
    await cursor.click('input[name="email"]', {
      delay: 100 + Math.floor(Math.random() * 100),
    });
    await cursor.click('input[name="email"]', {
      delay: 200 + Math.floor(Math.random() * 100),
    });
    for (let i = 0; i < inputValue.length; i++) {
      await page.keyboard.press("Backspace");
    }
    page.type('input[name="email"]', candidate.email);
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 + Math.floor(Math.random() * 500))
    );
  }
  await page.evaluate(() => {
    window.scrollBy(0, 50);
  });

  //   move the cursor randomly
  await cursor.move('input[name="phone"]', {
    delay: 100 + Math.floor(Math.random() * 100),
  });

  if (candidate.phone) {
    const inputValue = await page.$eval(
      'input[name="phone"]',
      (el: any) => el.value
    );
    await cursor.click('input[name="phone"]');
    await cursor.click('input[name="phone"]', {
      delay: 100 + Math.floor(Math.random() * 100),
    });
    await cursor.click('input[name="phone"]', {
      delay: 200 + Math.floor(Math.random() * 100),
    });
    for (let i = 0; i < inputValue.length; i++) {
      await page.keyboard.press("Backspace");
    }
    page.type('input[name="phone"]', candidate.phone);
    await new Promise((resolve) =>
      setTimeout(resolve, 2200 + Math.floor(Math.random() * 100))
    );
  }

  await page.evaluate(() => {
    window.scrollBy(0, 70);
  });

  await cursor.move('input[name="org"]', {
    delay: 100 + Math.floor(Math.random() * 100),
  });

  await page.evaluate(() => {
    window.scrollBy(0, 50);
  });

  if (candidate.current_company) {
    const inputValue = await page.$eval(
      'input[name="org"]',
      (el: any) => el.value
    );
    await cursor.click('input[name="org"]');
    await cursor.click('input[name="org"]', {
      delay: 100 + Math.floor(Math.random() * 100),
    });
    await cursor.click('input[name="org"]', {
      delay: 200 + Math.floor(Math.random() * 100),
    });
    for (let i = 0; i < inputValue.length; i++) {
      await page.keyboard.press("Backspace");
    }
    page.type('input[name="org"]', candidate.current_company);
    await cursor.click('input[name="org"]');
    await new Promise((resolve) =>
      setTimeout(resolve, 1300 + Math.floor(Math.random() * 100))
    );
  }

  await cursor.move('input[name="urls[LinkedIn]"]', {
    delay: 100 + Math.floor(Math.random() * 100),
  });

  await page.evaluate(() => {
    window.scrollBy(0, 150);
  });

  // if (candidate.current_location) {
  //     await cursor.click('input[name="location"]');
  //     page.type('input[name="location"]', candidate.current_location);
  //     await new Promise(resolve => setTimeout(resolve, 1000 * 3));
  // }

  const linkedin = await page.$('input[name="urls[LinkedIn]"]');
  if (candidate.linkedin_url && linkedin) {
    const inputValue = await page.$eval(
      'input[name="urls[LinkedIn]"]',
      (el: any) => el.value
    );
    await cursor.click('input[name="urls[LinkedIn]"]');
    await cursor.click('input[name="urls[LinkedIn]"]', {
      delay: 100 + Math.floor(Math.random() * 100),
    });
    await cursor.click('input[name="urls[LinkedIn]"]', {
      delay: 200 + Math.floor(Math.random() * 100),
    });
    for (let i = 0; i < inputValue.length; i++) {
      await page.keyboard.press("Backspace");
    }
    page.type('input[name="urls[LinkedIn]"]', candidate.linkedin_url);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  // const github = await page.$('input[name="urls[GitHub]"]');
  // if (candidate.github_url && github) {
  //     await cursor.click('input[name="urls[GitHub]"]');
  //     page.type('input[name="urls[GitHub]"]', candidate.github_url);
  //     await new Promise(resolve => setTimeout(resolve, 1000 * 1));
  // }

  // const twitter = await page.$('input[name="urls[Twitter]"]');
  // if (candidate.twitter_url && twitter) {
  //     await cursor.click('input[name="urls[Twitter]"]');
  //     page.type('input[name="urls[Twitter]"]', candidate.twitter_url);
  //     await new Promise(resolve => setTimeout(resolve, 1000 * 2));
  // }

  // const website = await page.$('input[name="urls[Portfolio]"]');
  // if (candidate.website_url && website) {
  //     await cursor.click('input[name="urls[Portfolio]"]');
  //     page.type('input[name="urls[Portfolio]"]', candidate.website_url);
  //     await new Promise(resolve => setTimeout(resolve, 1000 * 2));
  // }

  // const eeoGender = await page.$('select[name="eeo[gender]"]');
  // if (eeoGender) {
  //     const options = await page.$$eval('select[name="eeo[gender]"] option', options =>
  //     options.map(option => ({
  //         originalValue: option.value,
  //         lowercaseValue: option.value.toLowerCase()
  //     }))
  // );
  // console.log(options);

  //     const genderValue = candidate.gender.toLowerCase();
  //     const option = options.find(opt => opt.lowercaseValue === genderValue);
  //     if (option) {
  //         await page.select('select[name="eeo[gender]"]', option.originalValue);
  //     }
  // }

  // const eeoRace = await page.$('select[name="eeo[race]"]');
  // if (eeoRace) {
  //     const options = await page.$$eval('select[name="eeo[race]"] option', options =>
  //     options.map(option => ({
  //         originalValue: option.value,
  //         lowercaseValue: option.value.toLowerCase()
  //     }))
  // );
  // console.log(options);

  // const raceValue = candidate.race.toLowerCase();
  //     const option = options.find(opt => opt.lowercaseValue === raceValue);
  //     if (option) {
  //         await page.select('select[name="eeo[race]"]', option.originalValue);
  //     }
  // }

  // const eeoVeteran = await page.$('select[name="eeo[veteran]"]');
  // if (eeoVeteran) {
  //     const options = await page.$$eval('select[name="eeo[veteran]"] option', options =>
  //     options.map(option => ({
  //         originalValue: option.value,
  //         lowercaseValue: option.value.toLowerCase()
  //     }))
  // );
  // console.log(options);

  // const veteranValue = candidate.veteran_status.toLowerCase();
  // const option = options.find(opt => opt.lowercaseValue === veteranValue);
  // if (option) {
  //     await page.select('select[name="eeo[veteran]"]', option.originalValue);
  // }
  // }

  console.log("Filled in the details");

  return;
}

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
// main();
