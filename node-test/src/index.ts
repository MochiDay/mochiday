import { createCursor } from "ghost-cursor"
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import puppeteer from "puppeteer-extra";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function launchBrowser() {
    // @ts-ignore
    puppeteer.use(StealthPlugin())
    // Launch the browser and open a new blank page
    // @ts-ignore
    const browser = await puppeteer.launch({headless: false});
    return browser;
}

async function getCandidateDetailsFromDB() { // fetch by id
    return {
        name: 'John Doe',
        email: 'email@gmail.com',
        phone: '1234567890',
        linkedin: 'https://linkedin.com/in/johndoe',
        github: 'https://github.com/johndoe',
        location: 'New York, NY',
        org: 'ABC Startup',
    }};

async function uploadResume(page: any, resumePath: string) {
    const input = await page.$('input[id="resume-upload-input"]');
    if (input === null) {
        console.error('Input not found');
    } else {
        const filePath = path.relative(process.cwd(), __dirname + resumePath);
        // check if file exists
        if (!fs.existsSync(filePath)) {
            console.log(filePath);
            console.error('File not found');
        }
        // upload the file
        await input.uploadFile(filePath)
    }
    const timeout = 5000;
    await page.waitForFunction(
        `document.querySelector('.resume-upload-failure').style.display === 'inline' || document.querySelector('.resume-upload-success').style.display === 'inline'`,
        {timeout}
    ).then(async () => {
        console.log('File uploaded');
        return true;
    }
    ).catch(() => {
        console.error('File not uploaded');
        return false;
    });
    return false;
}

async function fillFormAndSubmit(page: any, cursor: any, selector: any, candidateDetails: any) {
    // Fill the form
    page.type('input[name="name"]', candidateDetails.name);
    await new Promise(resolve => setTimeout(resolve, 1000 * 2));
    page.type('input[name="email"]', candidateDetails.email);
    await new Promise(resolve => setTimeout(resolve, 1000 * 3));
    page.type('input[name="org"]', candidateDetails.org);
    await new Promise(resolve => setTimeout(resolve, 1000 * 3));
    page.type('input[name="phone"]', candidateDetails.phone);
    await new Promise(resolve => setTimeout(resolve, 1000 * 2));
    page.type('input[name="location"]', candidateDetails.location);
    await new Promise(resolve => setTimeout(resolve, 1000 * 4));
    page.type('input[name="urls[LinkedIn]"]', candidateDetails.linkedin);
    await new Promise(resolve => setTimeout(resolve, 1000 * 3));
    console.log('Filled in the details');
    await page.waitForSelector(selector)
    await cursor.click(selector)
    await page.waitForResponse(response => response.url().endsWith('/thanks')).then((response:any) => {
        console.log('Submitted the application');
        console.log(response.url()); //logging the response url if it ends with /thanks
        return true;
    }
    ).catch(() => {
        console.error('That means something wrong happened. We tell users to handle this application themselves.');
        return false;
    });
    return false;
}

async function applyToJob(link: string, page: any, cursor: any, selector: any, candidateDetails: any) {
    // Navigate the page to a URL
    await page.goto(link);

    // Set screen size
    await page.setViewport({width: 1080, height: 1090});

    // Fetch the resume
    const resumePath = '/resume.pdf';
    const resumeUploaded = await uploadResume(page, resumePath);
    if (!resumeUploaded) {
        console.error('Resume not uploaded');

    }
    // Fill the form
    const formFilled = await fillFormAndSubmit(page, cursor, selector, candidateDetails);
    if (!formFilled) {
        console.error('Form not filled');
    }
    return;
}

(async () => {
    const browser = await launchBrowser();
    const page = await browser.newPage();
    const cursor = createCursor(page);
    const selector = 'button[type="button"]';
    const link = 'https://jobs.lever.co/SprinterHealth/7d5b4207-299b-4520-83e3-fecf835e0efc/apply';
    const candidateDetails = await getCandidateDetailsFromDB();
    // await uploadResume(page);
    // await fillFormAndSubmit(page, cursor, candidateDetails);
    await applyToJob(link, page, cursor, selector, candidateDetails);
    await browser.close();
  })();
