import { LeverQuestionTypes } from "../types/types.js";

export const LeverConfig = {
  timeouts: {
    submitApplicationTimeout: 10_000,
  },
  selectors: {
    resumeUploaderSelector: 'input[id="resume-upload-input"]',
    submitApplicationButtonSelector: 'button[type="submit"]',
    customQuestionsSectionsSelector:
      'input[name^="cards"][name$="][baseTemplate]"]',
  },
  leverFillQuestionErrors: {
    optionNotFound: (question: string) =>
      `❌ Option not found for question: ${question}`,
    unsupportedFieldType: (fieldType: string) =>
      `❌ Unsupported field type: ${fieldType}`,
    multipleAnswersRequired:
      "❌ Multiple answers required for multiple-select field",
    errorAnsweringQuestion: (question: string) =>
      `❌ Error answering question: ${question}`,
    unableToFillRequiredQuestion: "❌ Unable to fill required question",
  },
  basicQuestionInputSelectors: [
    {
      selector: 'input[name="name"]',
      isProvided: (candidate: any) =>
        candidate.first_name && candidate.last_name,
      targetAnswer: (candidate: any) =>
        `${candidate.first_name} ${candidate.last_name}`,
    },
    {
      selector: 'input[name="email"]',
      isProvided: (candidate: any) => !!candidate.email,
      targetAnswer: (candidate: any) => candidate.email,
    },
    {
      selector: 'input[name="phone"]',
      isProvided: (candidate: any) => candidate.phone,
      targetAnswer: (candidate: any) => candidate.phone,
    },
    {
      selector: 'input[name="org"]',
      isProvided: (candidate: any) => !!candidate.current_company,
      targetAnswer: (candidate: any) => candidate.current_company,
    },
    {
      selector: 'input[name="urls[LinkedIn]',
      isProvided: (candidate: any) => !!candidate.linkedin_url,
      targetAnswer: (candidate: any) => candidate.linkedin_url,
    },
    {
      selector: 'input[name="urls[GitHub]',
      isProvided: (candidate: any) => !!candidate.github_url,
      targetAnswer: (candidate: any) => candidate.github_url,
    },
    {
      selector: 'input[name="urls[Twitter]',
      isProvided: (candidate: any) => false,
      targetAnswer: (candidate: any) => "",
    },
    {
      selector: 'input[name="urls[Portfolio]',
      isProvided: (candidate: any) => !!candidate.website_url,
      targetAnswer: (candidate: any) => candidate.website_url,
    },
    {
      selector: 'input[name="urls[Other]',
      isProvided: (candidate: any) => !!candidate.website_url,
      targetAnswer: (candidate: any) => candidate.website_url,
    },
  ],
  questionKewordsByQuestionType: [
    {
      type: LeverQuestionTypes.ELIGIBILITY,
      keywords: [
        "are you able to",
        "are you willing",
        "18 years",
        "sponsor",
        "unrestricted",
        "authori",
        "eligib",
        "permit",
      ],
      targetAnswer: (candidate: any) =>
        candidate.future_sponsership_required === null
          ? "No"
          : candidate.future_sponsership_required
          ? "Yes"
          : "No",
    },
    {
      type: LeverQuestionTypes.ACKNOWLEDGEMENT,
      keywords: ["i acknowledge"],
      targetAnswer: (candidate: any) => "i ack",
    },
    {
      type: LeverQuestionTypes.COMPENSATION,
      keywords: ["compensation", "salary"],
      targetAnswer: (candidate: any) => "80000",
    },
    {
      type: LeverQuestionTypes.HOW_DID_YOU_HEAR_ABOUT_US,
      keywords: ["how did you", "heard about"],
      targetAnswer: (candidate: any) => "LinkedIn",
    },
    {
      type: LeverQuestionTypes.ADDRESS,
      keywords: ["address"],
      targetAnswer: (candidate: any) => "123 Main St, Seattle, WA 98101",
    },
    {
      type: LeverQuestionTypes.FIRST_NAME,
      keywords: ["first name"],
      targetAnswer: (candidate: any) => candidate.first_name || "John",
    },
  ],
};
