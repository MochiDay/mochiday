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
        name: 'Johnny Doey',
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

async function answerSponsershipQuestion(page: any) {
    console.log('Answering sponsorship question');
    const sponsorshipQuestions = await page.$('input[name^="cards"][name$="][baseTemplate]"]');

    // get the name field
    const nameField = await page.evaluate((element: { name: any; }) => element.name, sponsorshipQuestions);
    // get the form unique code from the name field
    const name_code = nameField.split('[')[1].split(']')[0];

    
    if (sponsorshipQuestions) {
        // using puppeteer to get the value of the input field
        const inputFieldValue = await page.evaluate((element: { value: any; }) => element.value, sponsorshipQuestions);
        if (inputFieldValue) {
            const questionDetails = JSON.parse(inputFieldValue);
            // Check if the question text contains "sponsorship"
            console.log(questionDetails);
            const { fields } = questionDetails;
            var index = 0;
            for (const field of fields) {
                if (field.text.toLowerCase().includes('sponsorship')) {
                    console.log(field.text);
                    // Find the "Yes" option and click it
                    const yesOption = field.options.find((option: { text: string; }) => option.text.toLowerCase() === 'yes');
                    if (yesOption) {
                        console.log(yesOption.optionId);
                        const field_number = ["field", index].join('');
                        await page.click(`input[type="radio"][value="Yes"][name="cards[${name_code}][${field_number}]"`);
                        console.log('Answered sponsorship question');
                    } else {
                        console.error('Yes option not found for the sponsorship question');
                    }
                }
                index += 1;
        }
        
        }
                
    }
}




async function fillFormAndSubmit(page: any, cursor: any, selector: any, candidateDetails: any) {
    // Fill the form
    await cursor.click('input[name="name"]');
    page.type('input[name="name"]', candidateDetails.name);
    await new Promise(resolve => setTimeout(resolve, 1000 * 2));

    await cursor.click('input[name="email"]');
    page.type('input[name="email"]', candidateDetails.email);
    await new Promise(resolve => setTimeout(resolve, 1000 * 3));

    // await cursor.click('input[name="org"]');
    // page.type('input[name="org"]', candidateDetails.org);
    // await new Promise(resolve => setTimeout(resolve, 1000 * 3));

    // await cursor.click('input[name="phone"]');
    // page.type('input[name="phone"]', candidateDetails.phone);
    // await new Promise(resolve => setTimeout(resolve, 1000 * 2));

    // await cursor.click('input[name="location"]');
    // page.type('input[name="location"]', candidateDetails.location);
    // await new Promise(resolve => setTimeout(resolve, 1000 * 4));

    page.type('input[name="urls[LinkedIn]"]', candidateDetails.linkedin);
    await new Promise(resolve => setTimeout(resolve, 1000 * 3));

    console.log('Filled in the details');
    await page.waitForSelector(selector)
    await cursor.click(selector)

    // await for the response endsWith /thanks
    await page.waitForResponse((response: { url: () => string; }) => response.url().endsWith('/thanks')).then((response:any) => {
        console.log('Submitted the application');
        console.log(response.url()); //logging the response url if it ends with /thanks
        return true;
    }
    ).catch(() => {
        console.error('That means something wrong happened. We tell users to handle this application themselves.');
        return false;
    });
    return;
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
    await answerSponsershipQuestion(page);
    // Fill the form
    await fillFormAndSubmit(page, cursor, selector, candidateDetails);
    return;
}

(async () => {
    const browser = await launchBrowser();
    const page = await browser.newPage();
    const cursor = createCursor(page);
    const selector = 'button[type="button"]';
    // const link = 'https://jobs.lever.co/attentive/ae899b91-8ec1-4420-9e42-cf0abafda349/apply';
    const link = 'https://jobs.lever.co/Voxel/87e2acda-8b4d-4fd9-aafe-2b606f0e3d1f/apply';
    const candidateDetails = await getCandidateDetailsFromDB();
    await applyToJob(link, page, cursor, selector, candidateDetails);
    await browser.close();
  })();

