import { LeverConfig } from "../config/config.js";
import {
  LeverCustomQuestionField,
  LeverFillQuestionError,
} from "../types/types.js";
import { checkKeywordExist, sleep } from "../../../utils/general.js";
import { Engine } from "../../../types/shared.js";

export const leverInputHandlers = (
  engine: Engine,
  field: LeverCustomQuestionField,
  cardId: string,
  fieldId: string,
  targetAnswer: string | string[],
  multipleAnswers?: string[]
) => {
  return {
    handleDropdown: async () =>
      await handleDropdown(engine, field, targetAnswer, cardId, fieldId),
    handleTextArea: async () =>
      await handleTextArea(engine, cardId, fieldId, targetAnswer as string),
    handleText: async () =>
      await handleText(engine, cardId, fieldId, targetAnswer as string),
    handleMultipleSelect: async () =>
      await handleMultipleSelect(
        engine,
        cardId,
        fieldId,
        field,
        multipleAnswers
      ),
    handleMultipleChoice: async () =>
      await handleMultipleChoice(engine, cardId, fieldId, field, targetAnswer),
  };
};

export const handleBasicInputWithOverwrite = async (
  engine: Engine,
  selector: string,
  targetAnswer: string | null
) => {
  if (targetAnswer === null) return;

  const input = await engine.page.$(selector);

  if (input) {
    await engine.cursor.click(selector);
    await sleep(50 + Math.random() * 50);
    await input.click({ clickCount: 3, delay: 50 + Math.random() * 30 });
    await input.press("Backspace");
  }

  await sleep(100 + Math.random() * 200);
  await engine.page.type(selector, targetAnswer);
  await sleep(150 + Math.random() * 100);
  await engine.page.evaluate(() => {
    window.scrollBy(0, 50 + Math.random() * 100);
  });
  console.log(`✅ Filled basic question: ${selector}`);
};

const handleDropdown = async (
  engine: Engine,
  field: LeverCustomQuestionField,
  targetAnswer: string | string[],
  cardId: string,
  fieldId: string
) => {
  const isArray = Array.isArray(targetAnswer);
  const optionTextThatMatches = field.options?.find((option) =>
    isArray
      ? checkKeywordExist(option.text.toLowerCase(), targetAnswer)
      : option.text.toLowerCase().includes(targetAnswer.toLowerCase())
  );
  const dropdownSelector = `select[name="cards[${cardId}][${fieldId}]"]`;
  if (optionTextThatMatches) {
    await engine.cursor.click(dropdownSelector, {
      moveDelay: 200 + Math.random() * 100,
    });
    await engine.page.select(dropdownSelector, optionTextThatMatches.text);
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
  multipleAnswers?: string[]
) => {
  if (multipleAnswers) {
    const answeredIds: string[] = [];
    for (const answer of multipleAnswers) {
      const optionTextThatMatches = field.options?.find((option) => {
        return (
          option.text.toLowerCase().includes(answer.toLowerCase()) &&
          !answeredIds.includes(option.optionId)
        );
      });
      if (optionTextThatMatches) {
        const checkBoxSelectorMultiple = `input[type="checkbox"][value="${optionTextThatMatches.text}"][name="cards[${cardId}][responses][${fieldId}]"]`;
        const checkBoxSelectorSingle = `input[type="checkbox"][value="${optionTextThatMatches.text}"][name="cards[${cardId}][${fieldId}]"]`;

        const checkBoxSelector = (await engine.page.$(checkBoxSelectorMultiple))
          ? checkBoxSelectorMultiple
          : checkBoxSelectorSingle;

        await sleep(50 + Math.random() * 100);
        await engine.cursor.click(checkBoxSelector, {
          moveDelay: 200 + Math.random() * 100,
        });
        answeredIds.push(optionTextThatMatches.optionId);
      }
    }
    if (answeredIds.length === 0) {
      throw new LeverFillQuestionError(
        LeverConfig.leverFillQuestionErrors.optionNotFound(field.text)
      );
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
  targetAnswer: string | string[]
) => {
  const isArray = Array.isArray(targetAnswer);
  const multipleChoiceTextThatMatches = field.options?.find((option) =>
    isArray
      ? checkKeywordExist(option.text.toLowerCase(), targetAnswer)
      : option.text.toLowerCase().includes(targetAnswer.toLowerCase())
  );
  if (multipleChoiceTextThatMatches) {
    const radioSelector = `input[type="radio"][value="${multipleChoiceTextThatMatches.text}"][name="cards[${cardId}][${fieldId}]"]`;
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
