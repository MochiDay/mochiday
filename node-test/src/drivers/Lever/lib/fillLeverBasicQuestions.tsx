import { Engine } from "../../../types/shared.js";
import { sleep } from "../../../utils/general.js";
import { LeverConfig } from "../config/config.js";
import { handleBasicInputWithOverwrite } from "../handlers/inputHandlers.js";

export async function fillLeverBasicQuestions(engine: Engine) {
  console.log("Filling basic questions...");
  const basicQuestionInputSelectors = LeverConfig.basicQuestionInputSelectors;

  for (const input of basicQuestionInputSelectors) {
    if (input.isProvided(engine.candidate)) {
      await handleBasicInputWithOverwrite(
        engine,
        input.selector,
        input.targetAnswer(engine.candidate)
      );
      await sleep(700 + Math.random() * 500);
    }
  }
}
