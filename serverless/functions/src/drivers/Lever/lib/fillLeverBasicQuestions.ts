import { Engine } from "../../../types/shared.js";
import { shuffleArray, sleep } from "../../../utils/general.js";
import { LeverConfig } from "../config/config.js";
import { handleBasicInputWithOverwrite } from "../handlers/inputHandlers.js";

export async function fillLeverBasicQuestions(engine: Engine) {
  console.log("Filling basic questions...");
  const basicQuestionInputSelectors = LeverConfig.basicQuestionInputSelectors;
  const indicesArray = Array.from(
    { length: basicQuestionInputSelectors.length },
    (_, i) => i
  );
  shuffleArray(indicesArray);
  for (const i of indicesArray) {
    const input = basicQuestionInputSelectors[i];
    if (input.isProvided(engine.candidate)) {
      await handleBasicInputWithOverwrite(
        engine,
        input.selector,
        input.targetAnswer(engine.candidate)
      );
      await sleep(1000 + Math.random() * 1000);
    }
  }
}
