import { Engine } from "../../types/shared.js";
import { fillLeverBasicQuestions } from "./lib/fillLeverBasicQuestions.js";
import { fillLeverCustomQuestions } from "./lib/fillLeverCustomQuestions.js";
import { uploadResumeToLever } from "./lib/uploadResumeToLever.js";

// The resume is already downaloded to file path. Now just upload it to
// Lever, and then fill the rest
export const fillLeverApplication = async (
  engine: Engine,
  resumePath: string
) => {
  await uploadResumeToLever(engine, resumePath);
  await fillLeverBasicQuestions(engine);
  await fillLeverCustomQuestions(engine);
};
