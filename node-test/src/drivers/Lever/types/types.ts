export enum LeverQuestionTypes {
  ELIGIBILITY = "Eligibility",
  ACKNOWLEDGEMENT = "Acknowledgement",
  COMPENSATION = "Compensation",
  HOW_DID_YOU_HEAR_ABOUT_US = "How did you hear about us?",
  ADDRESS = "Address",
  FIRST_NAME = "First Name",
  LAST_NAME = "Last Name",
}

export interface LeverCustomQuestionFieldOption {
  text: string;
  optionId: string;
}

export interface LeverCustomQuestionField {
  type:
    | "dropdown" // select
    | "textarea" // textarea
    | "text" // input[type="text"]
    | "multiple-select" // input[type="checkbox"]
    | "multiple-choice"; // input[type="radio"]
  text: string;
  description: string;
  required: boolean;
  id: string;
  options?: LeverCustomQuestionFieldOption[];
  prompt?: string;
}

// MAke a new Error type
export class LeverFillQuestionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LeverFillQuestionError";
  }
}
