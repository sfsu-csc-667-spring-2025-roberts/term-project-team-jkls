import { create } from "./create";
import { dealCards } from "./deal-cards";
import { getAvailableGames } from "./get-available-games";
import { getCurrentGames } from "./get-current-games";
import { getHost } from "./get-host";
import { getInfo } from "./get-info";
import { getPlayers } from "./get-players";
import { getState } from "./get-state";
import { hasStarted } from "./has-started";
import { join } from "./join";
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