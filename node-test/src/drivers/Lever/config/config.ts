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
