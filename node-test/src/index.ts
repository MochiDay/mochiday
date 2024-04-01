import { createCursor } from "ghost-cursor"
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import puppeteer from "puppeteer-extra";
import {getAllJobs, getUserDetails} from '../database/queries.js';
import DownloaderHelper from 'node-downloader-helper';
import fs from 'fs';
import UserAgent from 'user-agents';
import RecaptchaPlugin from "puppeteer-extra-plugin-recaptcha";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


async function launchBrowser() {
    // @ts-ignore
    // puppeteer.use(StealthPlugin())

    // Launch the browser and open a new blank page
    // @ts-ignore
    const browser = await puppeteer.launch({headless: "new", args: ['--no-sandbox', "--disable-setuid-sandbox"]});
    return browser;
}

async function downloadResume(candidate: any) {
    const url = candidate.resume_link;
    const filename = url.split('/').pop();
    const dl = new DownloaderHelper.DownloaderHelper(url, __dirname);

    dl.on('end', () => console.log('Download Completed'));
    dl.on('error', (err) => console.log('Download Failed', err));
    await  dl.start().catch(err => console.error(err));
    return __dirname + '/' + filename;  
}

async function uploadResume(page: any, candidate: any) {
    const input = await page.$('input[id="resume-upload-input"]');
    let filePath;
    if (input === null) {
        console.error('Input not found');
        return;
    } else {
        filePath = await downloadResume(candidate);

        await input.uploadFile(filePath);
        
    }
    const timeout = 5000;
    await page.waitForFunction(
        `document.querySelector('.resume-upload-failure').style.display === 'inline' || document.querySelector('.resume-upload-success').style.display === 'inline'`,
        {timeout}
    ).then(async () => {
        console.log('File uploaded');
        return filePath;
    }
    ).catch(() => {
        console.error('File not uploaded');
        return;
    });
    return filePath;
}


async function answerCustomQuestions(page: any, auth_to_work_in_usa: boolean, future_sponsership_required: boolean, candidate: any) {

    const auth = auth_to_work_in_usa  === null ? "Yes": auth_to_work_in_usa ? "Yes" : "No";
    const sponsorship = future_sponsership_required === null ? "No": future_sponsership_required ? "Yes" : "No";

    const customQuestionsSections = await page.$$('input[name^="cards"][name$="][baseTemplate]"]');
    
    if (customQuestionsSections === null) {
        return {proceed: true, reason: 'No custom questions found'};
    }

    for (const customQuestions of customQuestionsSections) {
      // get the form unique code from the name field
    const nameField = await page.evaluate((element: { name: any; }) => element.name, customQuestions);

    const name_code = nameField.split('[')[1].split(']')[0];

    
    if (customQuestions) {
        const inputFieldValue = await page.evaluate((element: { value: any; }) => element.value, customQuestions);
        if (inputFieldValue) {
            const questionDetails = JSON.parse(inputFieldValue);
            const { fields } = questionDetails;
            console.log('fields', fields);
            var index = 0;
            for (const field of fields) {
                console.log(index)
                if (!field.required) continue;
                const fieldType = field.type;

                if ((field.text.toLowerCase().includes("are you able to") || field.text.toLowerCase().includes("are you willing") || field.text.toLowerCase().includes("18 years") || field.text.toLowerCase().includes('sponsor') || field.text.toLowerCase().includes('unrestricted') || field.text.toLowerCase().includes('authori')) || field.text.toLowerCase().includes('eligib') || field.text.toLowerCase().includes('permit')) {
                    const targetAnswer = field.text.toLowerCase().includes('sponsor') ? sponsorship : (field.text.toLowerCase().includes("are you able to") || field.text.toLowerCase().includes("are you willing") || field.text.toLowerCase().includes("18 years") )? "Yes" : auth;
                    switch (fieldType) {
                        case 'dropdown':
                            if (field.options.find((option: { text: string; }) => option.text.toLowerCase() === targetAnswer.toLowerCase())) {
                                const field_number = ["field", index].join('');
                                await page.select(`select[name="cards[${name_code}][${field_number}]"]`, targetAnswer);
                                console.log('Answered sponsorship question');
                            } else {
                                console.error('Yes option not found for the sponsorship question');
                                return {proceed: false, reason: 'Yes option not found for the sponsorship question'};
                            }
                            break;
                        case 'textarea':
                            console.log("TODO: textarea for sponsorship question not implemented")
                            break;
                        case 'input':
                            console.log("TODO: textarea for sponsorship question not implemented")
                            break;
                        case 'multiple-choice':
                        case 'radio':
                            console.log('radio index', index);
                            if (field.options.find((option: { text: string; }) => {
                                console.log('option', option);
                                return option.text.toLowerCase() === targetAnswer.toLowerCase()})) {
                                const field_number = ["field", index].join('');
                                await page.click(`input[type="radio"][value=${targetAnswer}][name="cards[${name_code}][${field_number}]"`);
                                console.log('Answered sponsorship question');
                            } else {
                                console.error('Response option not found for the question');
                                return {proceed: false, reason: 'Response option not found for the question'};
                            }
                            break;
                    }
                } 
                else if (field.text.toLowerCase().includes("i acknowledge")) {
                    const field_number = ["field", index].join('');
                   if (fieldType === "checkbox") await page.click(`input[type="checkbox"][name="cards[${name_code}][${field_number}]"]`);
                   else {
                          console.error('Acknowledgement field is not a checkbox, use needs to fill themselves');
                          return {proceed: false,  reason:'Acknowledgement field is not a checkbox, use needs to fill themselves'}
                   }
                //    if (fieldType === "dropdown") await page.select(`select[type="radio"][name="cards[${name_code}][${field_number}]"`);
                    console.log('Acknowledged');
                    index += 1;
                    continue;
                } else if (field.text.toLowerCase().includes("compensation") || field.text.toLowerCase().includes("salary")) {
                    const field_number = ["field", index].join('');
                    if (fieldType === "textarea" || fieldType === "text") {
                        await page.type(`textarea[name="cards[${name_code}][${field_number}]"]`, '80000');
                        console.log('Answered compensation question');
                    } else if (fieldType === "input") {
                        await page.type(`input[name="cards[${name_code}][${field_number}]"]`, '80000');
                        console.log('Answered compensation question');
                    }
                    else {
                        console.error('Compensation field is not an input field, use needs to fill themselves');
                        return {proceed: false, reason: 'Compensation field is not an input field, use needs to fill themselves'};
                    }
                } else if (field.text.toLowerCase().includes("how did you") || field.text.toLowerCase().includes("heard about")){
                    const field_number = ["field", index].join('');
                    if (fieldType === "dropdown") {
                        await page.select(`select[name="cards[${name_code}][${field_number}]"]`, 'LinkedIn');
                        console.log('Answered how did you hear about us question');
                    } else if (fieldType === "text" || fieldType === "textarea") {
                        await page.type(`textarea[name="cards[${name_code}][${field_number}]"]`, 'LinkedIn');
                        console.log('Answered how did you hear about us question');
                    } else if (fieldType === "input") {
                        await page.type(`input[name="cards[${name_code}][${field_number}]"]`, 'LinkedIn');
                        console.log('Answered how did you hear about us question');
                    }
                    else {
                        console.error('How did you hear about us field is not a dropdown, use needs to fill themselves');
                        return {proceed: false, reason: 'How did you hear about us field is not a dropdown, use needs to fill themselves'};
                    }
                }
                else if (field.text.toLowerCase().includes("address")) {
                    const field_number = ["field", index].join('');
                    if (fieldType === "text" || fieldType === "textarea") {
                        await page.type(`textarea[name="cards[${name_code}][${field_number}]"]`, '123 Main St, Seattle, WA 98101');
                        console.log('Answered address question');
                    } else if (fieldType === "input") {
                        await page.type(`input[name="cards[${name_code}][${field_number}]"]`, '123 Main St, Seattle, WA 98101');
                        console.log('Answered address question');
                    }
                } else if (field.text.toLowerCase().includes("first name")) {
                    const field_number = ["field", index].join('');
                    if (fieldType === "text" || fieldType === "textarea") {
                        await page.type(`textarea[name="cards[${name_code}][${field_number}]`, candidate.first_name ?? "John");
                        console.log('Answered first name question');
                    } else if (fieldType === "input") {
                        await page.type(`input[name="cards[${name_code}][${field_number}]`,  candidate.first_name ?? "John");
                        console.log('Answered first name question');
                    }
                }
                else {
                    // terminate the program
                    console.error('required custom question found that we cannot auto-fill');
                    fs.appendFileSync('fails.txt', `required custom question found that we cannot auto-fill: ${page.url()} ${JSON.stringify(field)}`);
                    return {proceed: false, reason: 'required custom question found that we cannot auto-fill'};
                }
                index += 1;

            }
                
        }
    }
    }
    console.log('All custom questions answered');
    return {proceed: true, reason: 'All custom questions answered'};
}


// TODO : Add hispanic?, disability, pronouns
// TODO : download and upload resume from storage
async function fillBasics(page: any, cursor: any, candidate: any) {
    // Fill the form
    console.log('Filling in the details');

    // if (candidate.first_name && candidate.last_name && candidate.middle_name) {
    //     await cursor.click('input[name="name"]');
    //     page.type('input[name="name"]', candidate.first_name + ' ' + candidate.middle_name + ' ' + candidate.last_name);
    //     await new Promise(resolve => setTimeout(resolve, 1000 * 3));
    // }

    if (candidate.first_name && candidate.last_name && !candidate.middle_name) {
        const inputValue = await page.$eval('input[name="name"]', (el: any) => el.value);
        await page.click('input[name="name"]');
        for (let i = 0; i < inputValue.length; i++) {
            await page.keyboard.press('Backspace');
          }

        // await page.click('input[name="name"]');
        page.type('input[name="name"]', candidate.first_name + ' ' + candidate.last_name);
        await new Promise(resolve => setTimeout(resolve, 200));
    }

    if (candidate.email) {
        const inputValue = await page.$eval('input[name="email"]', (el: any) => el.value);
        await page.click('input[name="email"]');
        for (let i = 0; i < inputValue.length; i++) {
            await page.keyboard.press('Backspace');
          }
        page.type('input[name="email"]', candidate.email);
        await new Promise(resolve => setTimeout(resolve,200));
    }

    if (candidate.phone) {
        const inputValue = await page.$eval('input[name="phone"]', (el: any) => el.value);
        await page.click('input[name="phone"]');
        for (let i = 0; i < inputValue.length; i++) {
            await page.keyboard.press('Backspace');
          }
        page.type('input[name="phone"]', candidate.phone);
        await cursor.click('input[name="phone"]');
        await new Promise(resolve => setTimeout(resolve, 200));
    }


    if (candidate.current_company) {
        const inputValue = await page.$eval('input[name="org"]', (el: any) => el.value);
        await page.click('input[name="org"]');
        for (let i = 0; i < inputValue.length; i++) {
            await page.keyboard.press('Backspace');
          }
          page.type('input[name="org"]', candidate.current_company);
          await cursor.click('input[name="org"]');
        await new Promise(resolve => setTimeout(resolve, 300));
    }
    


    // if (candidate.current_location) {
    //     await cursor.click('input[name="location"]');
    //     page.type('input[name="location"]', candidate.current_location);
    //     await new Promise(resolve => setTimeout(resolve, 1000 * 3));
    // }

    const linkedin = await page.$('input[name="urls[LinkedIn]"]');
    if (candidate.linkedin_url && linkedin) {
        const inputValue = await page.$eval('input[name="urls[LinkedIn]"]', (el: any) => el.value);
        await page.click('input[name="urls[LinkedIn]"]');
        for (let i = 0; i < inputValue.length; i++) {
            await page.keyboard.press('Backspace');
          }
          page.type('input[name="urls[LinkedIn]"]', candidate.linkedin_url);
          await cursor.click('input[name="urls[LinkedIn]"]');
        await new Promise(resolve => setTimeout(resolve, 300));
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


    console.log('Filled in the details');
   
    return;
}

async function submitApplication(page: any, selector: any, cursor: any) {
    await page.waitForSelector(selector)


    // await navigationPromise;
    // await Promise.all([
    //     page.waitForNavigation({waitUntil: 'load'}),
    //     cursor.click(selector)
    // ]);
    // await cursor.click(selector);
    // console.log('Clicked the submit button');

    // await page.waitForNavigation({waitUntil: 'networkidle0'});

    // const url = page.url();

    // if (url.includes('already-received')) {
    //     console.log('Already applied to this job');
    //     return;
    // } else if (url.endsWith('/thanks')) {
    //     console.log('Submitted the application');
    //     console.log(url);
    // } else {
    //     console.error('That means something wrong happened. We tell users to handle this application themselves.');
    // }
    await cursor.click(selector);

    await new Promise(resolve => setTimeout(resolve, 1000 * 3));

    // save screenshot of the page
    const jobId = page.url().split('/')[3];
    const screenshot = jobId + '-screenshot.png';
    await page.screenshot({path: screenshot});
    const url = page.url();
    if (url.includes('already-received')) {
        console.log('Already applied to this job');
        return true
    } else if (url.endsWith('/thanks')) {
        console.log('Submitted the application');
        console.log(url);
        return true
    } else {
        console.error('That means something wrong happened. We tell users to handle this application themselves.');
        return false
    }

    // await Promise.all([
    //     page.waitForResponse((response: { url: () => string; }) => response.url().endsWith('/thanks') || response.url().includes("already-received")).then((response:any) => {
    //         if (response.url().includes("already-received")) {
    //             console.log('Already applied to this job');
    //         } else if (response.url().endsWith('/thanks')) {
    //             console.log('Submitted the application');
    //             console.log(response.url()); 
    //         }
    //         return true;
    //     }
    //     ).catch((e: any) => {
    //         console.error(e);
    //         console.error('That means something wrong happened. We tell users to handle this application themselves.');
    //         return false;
    //     })
    //   ]);



}

async function goToLinkWithRetry(page: any, link:string, maxRetries = 3, timeout = 5000) {
    let retryCount = 0;
    while (retryCount < maxRetries) {
        try {
            await page.goto(link, { timeout });
            // await page.waitForNavigation();

            // If page.goto() succeeds, exit the loop
            return;
        } catch (error) {
            // Handle timeout error
            console.log(`Timeout occurred, retrying (${retryCount + 1}/${maxRetries})`);
            retryCount++;
            // Reload the page
            await page.reload({ waitUntil: 'domcontentloaded', timeout });
        }
    }
    // If max retries exceeded, throw an error
    throw new Error(`Failed to load ${link} after ${maxRetries} attempts.`);
}


async function applyToJob(link: string, page: any, cursor: any, selector: any, candidate: any) {
    // Navigate the page to a URL

    // set timeout for 5 seconds, otherwise refresh the page
    await page.setDefaultNavigationTimeout(0);

    await goToLinkWithRetry(page, link);

    // Set screen size
    // await page.setViewport({width: 1080, height: 3000});

    // Fetch the resume
    // const resumePath = '/resume.pdf';
    const resumePath = await uploadResume(page, candidate);
    if (!resumePath) {
        console.error('Resume not uploaded');
    }
     await fillBasics(page, cursor, candidate);
    // Answer the sponsorship question
    const {proceed, reason} = await answerCustomQuestions(page, candidate.auth_to_work_in_usa, candidate.future_sponsership_required, candidate);
    if (!proceed) {
        // mark db status
        console.error(reason);
        if (resumePath) fs.unlinkSync(resumePath);
        return {proceed, reason}
    } else  await submitApplication(page, selector, cursor);
    if (resumePath && fs.existsSync(resumePath)) fs.unlinkSync(resumePath);
    return false
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

// export async function main(): Promise<void> {
//     const candidate = await details("5");
//     // console.log(candidate);
//     const browser = await launchBrowser();
//     // if the page is loading too slow, refresh the page
//     const page = await browser.newPage()
//     const cursor = createCursor(page);
//     // select the button that has id btn-submit
//     const selector = 'button[id="btn-submit"]';
//     const link = 'https://jobs.lever.co/outreach/5111046d-f15d-4f33-a98e-6799a8a81fed/apply';
//     await applyToJob(link, page, cursor, selector, candidate);
//     await browser.close();
//     return;
// }

export async function main() {

    const candidate = await details("5");
    let jobs = await getAllJobs();

    if (jobs.data) {
        // start at index 4
        // jobs = jobs.data.slice(6);
    for (const job of jobs.data.slice(1)) {
        
        const browser = await launchBrowser();
        const page = await browser.newPage();
        // const userAgent = UserAgent.random().toString();
        // const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36';

        // const UA = userAgent || USER_AGENT;
        // await page.setUserAgent(UA)
        await page.setViewport({
            width: 1920 + Math.floor(Math.random() * 100),
            height: 3000 + Math.floor(Math.random() * 100),
            deviceScaleFactor: 1,
            hasTouch: false,
            isLandscape: false,
            isMobile: false,
        });
        await page.setJavaScriptEnabled(true);
        //Skip images/styles/fonts loading for performance
    // await page.setRequestInterception(true);
    // page.on('request', (req) => {
    //     if(req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image'){
    //         req.abort();
    //     } else {
    //         req.continue();
    //     }
    // });

    // await page.evaluateOnNewDocument(() => {
    //     // Pass webdriver check
    //     Object.defineProperty(navigator, 'webdriver', {
    //         get: () => false,
    //     });
    // });

    // await page.evaluateOnNewDocument(() => {
    //     // Pass chrome check
    //     window.chrome = {
    //         runtime: {},
    //         // etc.
    //     };
    // });

    // await page.evaluateOnNewDocument(() => {
    //     //Pass notifications check
    //     const originalQuery = window.navigator.permissions.query;
    //     return window.navigator.permissions.query = (parameters) => (
    //         parameters.name === 'notifications' ?
    //             Promise.resolve({ state: Notification.permission }) :
    //             originalQuery(parameters)
    //     );
    // });

    // await page.evaluateOnNewDocument(() => {
    //     // Overwrite the `plugins` property to use a custom getter.
    //     Object.defineProperty(navigator, 'plugins', {
    //         // This just needs to have `length > 0` for the current test,
    //         // but we could mock the plugins too if necessary.
    //         get: () => [1, 2, 3, 4, 5],
    //     });
    // });

    // await page.evaluateOnNewDocument(() => {
    //     // Overwrite the `languages` property to use a custom getter.
    //     Object.defineProperty(navigator, 'languages', {
    //         get: () => ['en-US', 'en'],
    //     });
    // });

        

    try {
        const cursor = createCursor(page);
        const selector = 'button[id="btn-submit"]';
        const link = job.job_url;
        const result  = await applyToJob(link, page, cursor, selector, candidate);
        if (result) {
            console.log("Action required:", result.reason);
        } else {
            console.log('Application submitted');
        }
    } catch (error) {
        console.error(error);
        // take a screenshot
        const screenshot = job.id + 'screenshot.png';
        await page.screenshot({path: screenshot});

    }
    await browser.close();

    }
}
}

main();


