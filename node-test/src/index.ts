import { createCursor } from "ghost-cursor"
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import puppeteer from "puppeteer-extra";
import {getUserDetails} from '../database/queries.js';

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


async function answerSponsershipQuestions(page: any, auth_to_work_in_usa: boolean, future_sponsership_required: boolean) {
    console.log('Answering sponsorship questions');

    const auth = auth_to_work_in_usa ? "Yes" : "No";
    const sponsorship = future_sponsership_required ? "Yes" : "No";

    const sponsorshipQuestions = await page.$('input[name^="cards"][name$="][baseTemplate]"]');

    // get the form unique code from the name field
    const nameField = await page.evaluate((element: { name: any; }) => element.name, sponsorshipQuestions);
    const name_code = nameField.split('[')[1].split(']')[0];

    
    if (sponsorshipQuestions) {
        // using puppeteer to get the value of the input field
        const inputFieldValue = await page.evaluate((element: { value: any; }) => element.value, sponsorshipQuestions);
        if (inputFieldValue) {
            const questionDetails = JSON.parse(inputFieldValue);
            // Check if the question text contains "sponsorship"
            const { fields } = questionDetails;

            // Answering the sponsorship question
            var index = 0;
            for (const field of fields) {
                if (field.text.toLowerCase().includes('sponsorship')) {
                    console.log(field.text);
                    // Find the "Yes" option and click it
                    const yesOption = field.options.find((option: { text: string; }) => option.text.toLowerCase() === 'yes');
                    if (yesOption) {
                        const field_number = ["field", index].join('');
                        await page.click(`input[type="radio"][value=${sponsorship}][name="cards[${name_code}][${field_number}]"`);
                        console.log('Answered sponsorship question');
                    } else {
                        console.error('Yes option not found for the sponsorship question');
                    }
                }
                index += 1;
            }

            // Answering the authorization question
            var index = 0;
            for (const field of fields) {
                if (field.text.toLowerCase().includes('authorization') || field.text.toLowerCase().includes('authorized')) {
                    console.log(field.text);
                    // Find the "Yes" option and click it
                    const yesOption = field.options.find((option: { text: string; }) => option.text.toLowerCase() === 'yes');
                    if (yesOption) {
                        const field_number = ["field", index].join('');
                        await page.click(`input[type="radio"][value=${auth}][name="cards[${name_code}][${field_number}]"`);
                        console.log('Answered authorization question');
                    } else {
                        console.error('Yes option not found for the authorization question');
                    }
                }
                index += 1;
            }
                
        }
    }
}


// TODO : Add auth_to_work, hispanic?, race, gender, veteran, disability, pronouns, website, website, github, twitter
// TODO : download and upload resume from storage
async function fillFormAndSubmit(page: any, cursor: any, selector: any, candidate: any) {
    // Fill the form
    console.log('Filling in the details');

    if (candidate.first_name && candidate.last_name && candidate.middle_name) {
        await cursor.click('input[name="name"]');
        page.type('input[name="name"]', candidate.first_name + ' ' + candidate.middle_name + ' ' + candidate.last_name);
        await new Promise(resolve => setTimeout(resolve, 1000 * 3));
    }

    if (candidate.first_name && candidate.last_name && !candidate.middle_name) {
        await cursor.click('input[name="name"]');
        page.type('input[name="name"]', candidate.first_name + ' ' + candidate.last_name);
        await new Promise(resolve => setTimeout(resolve, 1000 * 3));
    }

    if (candidate.email) {
        await cursor.click('input[name="email"]');
        page.type('input[name="email"]', candidate.email);
        await new Promise(resolve => setTimeout(resolve, 1000 * 3));
    }

    if (candidate.current_company) {
        await cursor.click('input[name="org"]');
        page.type('input[name="org"]', candidate.current_company);
        await new Promise(resolve => setTimeout(resolve, 1000 * 3));
    }
    
    if (candidate.phone) {
        await cursor.click('input[name="phone"]');
        page.type('input[name="phone"]', candidate.phone);
        await new Promise(resolve => setTimeout(resolve, 1000 * 3));
    }

    if (candidate.current_location) {
        await cursor.click('input[name="location"]');
        page.type('input[name="location"]', candidate.current_location);
        await new Promise(resolve => setTimeout(resolve, 1000 * 3));
    }

    if (candidate.linkedin) {
        await cursor.click('input[name="urls[LinkedIn]"]');
        page.type('input[name="urls[LinkedIn]"]', candidate.linkedin);
        await new Promise(resolve => setTimeout(resolve, 1000 * 3));
    }
    
    // check if the form has eeo["Gender"] field
    const eeoGender = await page.$('select[name="eeo[gender]"]');
    if (eeoGender) {
        const options = await page.$$eval('select[name="eeo[gender]"] option', options =>
        options.map(option => ({
            originalValue: option.value,
            lowercaseValue: option.value.toLowerCase()
        }))
    );
        console.log(options);

        const genderValue = candidate.gender.toLowerCase();
        const option = options.find(opt => opt.lowercaseValue === genderValue);
        if (option) {
            await page.select('select[name="eeo[gender]"]', option.originalValue);
        }
    }

    const eeoVeteran = await page.$('select[name="eeo[veteran]"]');
    if (eeoVeteran) {
        const options = await page.$$eval('select[name="eeo[veteran]"] option', options =>
        options.map(option => ({
            originalValue: option.value,
            lowercaseValue: option.value.toLowerCase()
        }))
    );
        console.log(options);

        const veteranValue = candidate.gender.toLowerCase();
        const option = options.find(opt => opt.lowercaseValue === veteranValue);
        if (option) {
            await page.select('select[name="eeo[veteran]"]', option.originalValue);
        }
    }


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


async function applyToJob(link: string, page: any, cursor: any, selector: any, candidate: any) {
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
    // Answer the sponsorship question
    await answerSponsershipQuestions(page, candidate.auth_to_work_in_usa, candidate.future_sponsership_required);
    // Fill the rest of form
    await fillFormAndSubmit(page, cursor, selector, candidate);
    return;
}

async function details(user_id: string) {
    const userDetails = await getUserDetails(user_id)
    if (userDetails.error) {
        console.error('Error fetching user details');
        return;
    }

    const candidate = userDetails.data[0];
    return candidate;
}

export async function main(user_id: string): Promise<void> {
    const candidate = await details(user_id);
    // console.log(candidate);
    const browser = await launchBrowser();
    const page = await browser.newPage();
    const cursor = createCursor(page);
    const selector = 'button[type="button"]';
    const link = 'https://jobs.lever.co/Voxel/87e2acda-8b4d-4fd9-aafe-2b606f0e3d1f/apply';
    await applyToJob(link, page, cursor, selector, candidate);
    await browser.close();
    return;
}

main('5');