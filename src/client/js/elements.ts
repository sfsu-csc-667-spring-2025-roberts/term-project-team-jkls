
export const CHAT_FORM = "#chat form";
export const CHAT_INPUT = "#chat input";
export const CHAT_MESSAGES = "#chat #messages";
export const OVERLAY = "#overlay";
export const START_GAME_BUTTON = "#create-game";
export const PLAY_AREA = "#play-area";
export const CREATE_GAME_CONTAINER = "#create-game-container";

const elements = {
  CHAT_FORM: document.querySelector<HTMLFormElement>(CHAT_FORM)!,
  CHAT_INPUT: document.querySelector<HTMLInputElement>(CHAT_INPUT)!,
  CHAT_MESSAGES: document.querySelector<HTMLDivElement>(CHAT_MESSAGES)!,
  OVERLAY: document.querySelector<HTMLDivElement>(OVERLAY)!,
  START_GAME_BUTTON: document.querySelector<HTMLButtonElement>(
    START_GAME_BUTTON,
  )!,
  PLAY_AREA: document.querySelector<HTMLDivElement>(PLAY_AREA)!,
};

export default elements;