// import { cleanUpBuildPile } from "./clean-up-build-pile";
import { create } from "./create";
import { dealCards } from "./deal-cards";
// import { discardCard } from "./discard-card";
// import { doesPlayerHaveCard } from "./does-player-have-card";
// import { drawCard } from "./draw-card";
// import { endPlayerTurn } from "./end-player-turn";
import { getAvailableGames } from "./get-available-games";
// import { getBuildPileTop } from "./get-build-pile-top";
// import { getCardValue } from "./get-card-value";
import { getCurrentGames } from "./get-current-games";
// import { getCurrentPlayer } from "./get-current-player";
import { getHost } from "./get-host";
import { getInfo } from "./get-info";
// import { getNextPlayer } from "./get-next-player";
import { getPlayers } from "./get-players";
import { getState } from "./get-state";
import { hasStarted } from "./has-started";
import { join } from "./join";
// import { playCard } from "./play-card";
import { setCurrentPlayer } from "./set-current-player";
import { start } from "./start-game";
import { removePlayer } from "./remove-player";
import { deleteEmptyGame } from "./delete-empty-game";
import { broadcastGameState } from "./broadcast-game-state";

export * as cardLocations from "./constants";

export default {
  create,
  getState,
  getHost,
  getInfo,
  dealCards,
  getAvailableGames,
  getCurrentGames,
  removePlayer,
  getPlayers,
  hasStarted,
  join,
  deleteEmptyGame,
  setCurrentPlayer,
  start,
  broadcastGameState,
};