import { Candidate } from "../../../types/supabase.js";
import { LeverQuestionTypes } from "../types/types.js";

export const LeverConfig = {
  timeouts: {
    submitApplicationTimeout: 10_000,
  },
  selectors: {
    resumeUploaderSelector: 'input[id="resume-upload-input"]',
    submitApplicationButtonSelector: 'button[id="btn-submit"]',
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
      isProvided: (candidate: Candidate) =>
        candidate.first_name && candidate.last_name,
      targetAnswer: (candidate: Candidate) =>
        `${candidate.first_name} ${candidate.last_name}`,
    },
    {
      selector: 'input[name="email"]',
      isProvided: (candidate: Candidate) => !!candidate.email,
      targetAnswer: (candidate: Candidate) => candidate.email,
    },
    {
      selector: 'input[name="phone"]',
      isProvided: (candidate: Candidate) => candidate.phone,
      targetAnswer: (candidate: Candidate) => candidate.phone,
    },
    {
      selector: 'input[name="org"]',
      isProvided: (candidate: Candidate) => !!candidate.current_company,
      targetAnswer: (candidate: Candidate) => candidate.current_company,
    },
    {
      selector: 'input[name="urls[LinkedIn]"]',
      isProvided: (candidate: Candidate) => !!candidate.linkedin_url,
      targetAnswer: (candidate: Candidate) => candidate.linkedin_url,
    },
    {
      selector: 'input[name="urls[GitHub]"]',
      isProvided: (candidate: Candidate) => !!candidate.github_url,
      targetAnswer: (candidate: Candidate) => candidate.github_url,
    },
    {
      selector: 'input[name="urls[Twitter]"]',
      isProvided: (candidate: Candidate) => false,
      targetAnswer: (candidate: Candidate) => "",
    },
    {
      selector: 'input[name="urls[Portfolio]"]',
      isProvided: (candidate: Candidate) => !!candidate.website_url,
      targetAnswer: (candidate: Candidate) => candidate.website_url,
    },
    {
      selector: 'input[name="urls[Other]"]',
      isProvided: (candidate: Candidate) => !!candidate.website_url,
      targetAnswer: (candidate: Candidate) => candidate.website_url,
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
      targetAnswer: (candidate: Candidate) =>
        candidate.future_sponsership_required === null
          ? "No"
          : candidate.future_sponsership_required
          ? "Yes"
          : "No",
    },
    {
      type: LeverQuestionTypes.ACKNOWLEDGEMENT,
      keywords: ["i acknowledge", "privacy policy", "acknowledge"],
      targetAnswer: (candidate: Candidate) => [
        "ack",
        "agree",
        "accept",
        "confirm",
        "yes",
      ],
      multipleAnswers: ["i ack", "i agree"],
    },
    {
      type: LeverQuestionTypes.COMPENSATION,
      keywords: ["compensation", "salary"],
      targetAnswer: (candidate: Candidate) => "80000",
    },
    {
      type: LeverQuestionTypes.HOW_DID_YOU_HEAR_ABOUT_US,
      keywords: ["how did you", "heard about"],
      targetAnswer: (candidate: Candidate) => "LinkedIn",
    },
    {
      type: LeverQuestionTypes.ADDRESS,
      keywords: ["address"],
      targetAnswer: (candidate: Candidate) => "123 Main St, Seattle, WA 98101",
    },
    {
      type: LeverQuestionTypes.FIRST_NAME,
      keywords: ["first name"],
      targetAnswer: (candidate: Candidate) => candidate.first_name || "John",
    },
  ],
};
