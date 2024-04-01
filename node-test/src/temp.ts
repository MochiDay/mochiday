import { createCursor } from "ghost-cursor"
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import puppeteer from "puppeteer-extra";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



(async () => {
  // @ts-ignore
  puppeteer.use(StealthPlugin())

  // Launch the browser and open a new blank page
  // @ts-ignore
  const browser = await puppeteer.launch({headless: false});
  // const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const cursor = createCursor(page)
  const selector = 'button[type="button"]';

  // await page.setExtraHTTPHeaders({ 
	// 	'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36', 
	// 	'upgrade-insecure-requests': '1', 
	// 	'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8', 
	// 	'accept-encoding': 'gzip, deflate, br', 
	// 	'accept-language': 'en-US,en;q=0.9,en;q=0.8' 
	// }); 

  // Navigate the page to a URL
  // await page.goto('https://bot.sannysoft.com/');
  await page.goto('https://jobs.lever.co/SprinterHealth/7d5b4207-299b-4520-83e3-fecf835e0efc/apply');
  

  // Set screen size
  await page.setViewport({width: 1080, height: 1024});



  // Wait for the selector to appear
  const input = await page.$('input[id="resume-upload-input"]');
  if (input === null) {
    console.error('Input not found');
  } else {

    const filePath = path.relative(process.cwd(), __dirname + '/resume.pdf');
    // check if file exists
    if (!fs.existsSync(filePath)) {
      console.log(filePath);
      console.error('File not found');
    }

    // upload the file
  await input.uploadFile(filePath)

  


  const timeout = 5000;
    // const randInt = Math.floor(Math.random() * 6) + 1;
    // console.log(`Waiting for ${randInt} seconds`);
    await page.waitForFunction(
      `document.querySelector('.resume-upload-failure').style.display === 'inline' || document.querySelector('.resume-upload-success').style.display === 'inline'`,
      {timeout}
    ).then(async () => {
      console.log('File uploaded');
      await new Promise(resolve => setTimeout(resolve, 1000));
      page.type('input[name="name"]', 'Emily Yang');
      await new Promise(resolve => setTimeout(resolve, 1000 * 2));
      page.type('input[name="email"]', 'dkbroty@gmail.com');
      await new Promise(resolve => setTimeout(resolve, 1000 * 4));
      page.type('input[name="org"]', 'Santa House');
      await new Promise(resolve => setTimeout(resolve, 1000 ));
      page.type('input[name="phone"]', '1234567890');
      await new Promise(resolve => setTimeout(resolve, 1000 * 6));
      page.type('input[name="location"]', 'Lagos, Nigeria');
      await new Promise(resolve => setTimeout(resolve, 1000 * 3));
      page.type('input[name="urls[LinkedIn]"]', 'https://www.linkedin.com/in/dkbroty/');
      console.log('Filled in the details');
      // page.select('select[name="org"]', 'Engineering');
      await new Promise(resolve => setTimeout(resolve, 1000 * 2));
      // page.click('btn-submit');
      await page.waitForSelector(selector)
      await cursor.click(selector)
      // await for the response endsWith /thanks
      await page.waitForResponse(response => response.url().endsWith('/thanks')).then((response:any) => {
        console.log('Submitted the application');
        console.log(response.url()); //logging the response url if it ends with /thanks
      }).catch(() => {
        console.error('That means something wrong happened. We tell users to handle this application themselves.');
      } );
    }).catch(() => {
      console.error('That means something wrong happened. We tell users to handle this application themselves.');
    } );

  }
  


})();
