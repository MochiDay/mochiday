import { LeverConfig } from "../config/config.js";
import {
  LeverCustomQuestionField,
  LeverFillQuestionError,
} from "../types/types.js";

import { leverInputHandlers } from "../handlers/inputHandlers.js";
import { checkKeywordExist } from "../../../utils/general.js";
import { Engine } from "../../../types/shared.js";

export async function fillLeverCustomQuestions(engine: Engine) {
  console.log("Filling custom questions...");

  const customQuestionsSections = await engine.page.$$(
    LeverConfig.selectors.customQuestionsSectionsSelector
  );

  if (!customQuestionsSections) return;

  for (const customQuestionsSection of customQuestionsSections) {
    const customQuestionsSectionValue = await engine.page.evaluate(
      (element: { value: any }) => element.value,
      customQuestionsSection
    );

    if (!customQuestionsSectionValue) continue;

    const ustomQuestionsSectionParsedData = JSON.parse(
      customQuestionsSectionValue
    );
    const { fields, id } = ustomQuestionsSectionParsedData;
    for (let index = 0; index < fields.length; index++) {
      const field = fields[index];
      if (field.required) {
        console.log(`Filling required question: ${field.text}`);
        await handleCustomQuestion(engine, id, index, field);
      }
    }
  }

  console.log("✅ All custom questions answered");
}

const handleCustomQuestion = async (
  engine: Engine,
  cardId: string,
  index: number,
  field: LeverCustomQuestionField
) => {
  let answered = false;

  for (const {
    keywords,
    targetAnswer,
  } of LeverConfig.questionKewordsByQuestionType) {
    if (checkKeywordExist(field.text, keywords)) {
      answered = true;
      await answerQuestion(
        engine,
        cardId,
        index,
        field,
        targetAnswer(engine.candidate)
      );
    }
  }

  if (!answered) {
    throw new LeverFillQuestionError(
      LeverConfig.leverFillQuestionErrors.unableToFillRequiredQuestion
    );
  }
};

// TODO: use AI for some fields
const answerQuestion = async (
  engine: Engine,
  cardId: string,
  index: number,
  field: LeverCustomQuestionField,
  targetAnswer: string,
  multipleAnswers?: string[]
) => {
  const fieldId = `field${index}`;
  const handlers = leverInputHandlers(
    engine,
    field,
    cardId,
    fieldId,
    targetAnswer,
    multipleAnswers
  );
  switch (field.type) {
    case "dropdown":
      return await handlers.handleDropdown();
    case "textarea":
      return await handlers.handleTextArea();
    case "text":
      return await handlers.handleText();
    case "multiple-select":
      return await handlers.handleMultipleSelect();
    case "multiple-choice":
      return await handlers.handleMultipleChoice();
    default:
      throw new LeverFillQuestionError(
        LeverConfig.leverFillQuestionErrors.unsupportedFieldType(field.type)
      );
  }
};
