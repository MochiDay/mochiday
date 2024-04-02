import { LeverConfig } from "../config/config.js";
import {
  LeverCustomQuestionField,
  LeverFillQuestionError,
} from "../types/types.js";
import { sleep } from "../../../utils/general.js";
import { Engine } from "../../../types/shared.js";

export const leverInputHandlers = (
  engine: Engine,
  field: LeverCustomQuestionField,
  cardId: string,
  fieldId: string,
  targetAnswer: string,
  multipleAnswers?: string[]
) => {
  return {
    handleDropdown: async () =>
      await handleDropdown(engine, field, targetAnswer, cardId, fieldId),
    handleTextArea: async () =>
      await handleTextArea(engine, cardId, fieldId, targetAnswer),
    handleText: async () =>
      await handleText(engine, cardId, fieldId, targetAnswer),
    handleMultipleSelect: async () =>
      await handleMultipleSelect(
        engine,
        cardId,
        fieldId,
        field,
        multipleAnswers ?? []
      ),
    handleMultipleChoice: async () =>
      await handleMultipleChoice(engine, cardId, fieldId, field, targetAnswer),
  };
};

const handleDropdown = async (
  engine: Engine,
  field: LeverCustomQuestionField,
  targetAnswer: string,
  cardId: string,
  fieldId: string
) => {
  const optionTextThatMatches = field.options?.find(
    (option) => option.text.toLowerCase() === targetAnswer.toLowerCase()
  );
  const dropdownSelector = `select[name="cards[${cardId}][${fieldId}]"]`;
  if (optionTextThatMatches) {
    await engine.cursor.click(dropdownSelector, {
      moveDelay: 200 + Math.random() * 100,
    });
    await engine.page.select(dropdownSelector, optionTextThatMatches!.text);
  } else {
    throw new LeverFillQuestionError(
      LeverConfig.leverFillQuestionErrors.optionNotFound(field.text)
    );
  }
};

const handleTextArea = async (
  engine: Engine,
  cardId: string,
  fieldId: string,
  targetAnswer: string
) => {
  const textareaSelector = `textarea[name="cards[${cardId}][${fieldId}]"]`;
  await engine.cursor.click(textareaSelector, {
    moveDelay: 200 + Math.random() * 100,
  });
  await engine.page.type(textareaSelector, targetAnswer);
};

const handleText = async (
  engine: Engine,
  cardId: string,
  fieldId: string,
  targetAnswer: string
) => {
  const textSelector = `input[name="cards[${cardId}][${fieldId}]"]`;
  await engine.cursor.click(textSelector, {
    moveDelay: 200 + Math.random() * 100,
  });
  await engine.page.type(textSelector, targetAnswer);
};

const handleMultipleSelect = async (
  engine: Engine,
  cardId: string,
  fieldId: string,
  field: LeverCustomQuestionField,
  multipleAnswers: string[]
) => {
  if (multipleAnswers) {
    for (const answer of multipleAnswers) {
      const optionTextThatMatches = field.options?.find(
        (option) => option.text.toLowerCase() === answer.toLowerCase()
      );
      if (optionTextThatMatches) {
        const checkBoxSelector = `input[type="checkbox"][value="${optionTextThatMatches.optionId}"][name="cards[${cardId}][responses][${fieldId}]"]`;
        await sleep(50 + Math.random() * 100);
        await engine.cursor.move(checkBoxSelector, {
          moveDelay: 200 + Math.random() * 100,
        });
        await engine.page.click(checkBoxSelector);
      } else {
        throw new LeverFillQuestionError(
          LeverConfig.leverFillQuestionErrors.optionNotFound(field.text)
        );
      }
    }
  } else {
    throw new LeverFillQuestionError(
      LeverConfig.leverFillQuestionErrors.multipleAnswersRequired
    );
  }
};

const handleMultipleChoice = async (
  engine: Engine,
  cardId: string,
  fieldId: string,
  field: LeverCustomQuestionField,
  targetAnswer: string
) => {
  const multipleChoiceTextThatMatches = field.options?.find(
    (option) => option.text.toLowerCase() === targetAnswer.toLowerCase()
  );
  if (multipleChoiceTextThatMatches) {
    const radioSelector = `input[type="radio"][value="${multipleChoiceTextThatMatches.optionId}"][name="cards[${cardId}][responses][${fieldId}]"]`;
    await engine.cursor.click(radioSelector, {
      moveDelay: 200 + Math.random() * 100,
    });
    await engine.page.click(radioSelector);
  } else {
    throw new LeverFillQuestionError(
      LeverConfig.leverFillQuestionErrors.optionNotFound(field.text)
    );
  }
};
