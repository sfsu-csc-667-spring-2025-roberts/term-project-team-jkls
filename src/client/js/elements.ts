
export const CHAT_FORM = "#chat form";
export const CHAT_INPUT = "#chat input";
export const CHAT_MESSAGES = "#chat #messages";
export const OVERLAY = "#game-table-waiting-overlay";
export const START_GAME_BUTTON = "#start-game-button";
export const CREATE_GAME = "#create-game";
export const CREATE_GAME_BUTTON = "#create-game-button";
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
  CREATE_GAME_BUTTON: document.querySelector<HTMLButtonElement>(
    CREATE_GAME_BUTTON,
  )!,
  CREATE_GAME: document.querySelector<HTMLDivElement>(CREATE_GAME)!,
  PLAY_AREA: document.querySelector<HTMLDivElement>(PLAY_AREA)!,
};

export default elements;