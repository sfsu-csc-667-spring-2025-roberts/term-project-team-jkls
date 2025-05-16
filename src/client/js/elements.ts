
export const CHAT_FORM = "#chat form";
export const CHAT_INPUT = "#chat input";
export const CHAT_MESSAGES = "#chat #messages";

const elements = {
  CHAT_FORM: document.querySelector<HTMLFormElement>(CHAT_FORM)!,
  CHAT_INPUT: document.querySelector<HTMLInputElement>(CHAT_INPUT)!,
  CHAT_MESSAGES: document.querySelector<HTMLDivElement>(CHAT_MESSAGES)!,
};

export default elements;