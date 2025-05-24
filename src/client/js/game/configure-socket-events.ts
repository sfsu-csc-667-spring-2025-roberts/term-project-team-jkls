import { PlayerGameState } from "global";
import UI from "../elements";
import { socket } from "../sockets";
import { getGameId } from "../utils";
import { currentPlayer, otherPlayer } from "./create-players";
import { updateGameStatus } from "./update-game-status";
import { updateTurnTimer } from "./update-turn-timer";

export const configureSocketEvents = () => {
  const gameId = getGameId();
  

  socket.on(`game:${gameId}:updated`, (gameState: PlayerGameState) => {
    // Remove waiting overlay
    if (UI.OVERLAY?.parentElement) {
      UI.OVERLAY.parentElement.removeChild(UI.OVERLAY);
    }

    // Show game status overlay when game starts
    const statusOverlay = document.getElementById('game-status-overlay');
    if (statusOverlay) {
      statusOverlay.classList.add('visible');
    }

    // Update play area to show it has started
    if (UI.PLAY_AREA) {
      UI.PLAY_AREA.classList.add('started', 'play-area-after-start');
      UI.PLAY_AREA.classList.remove('play-area-before-start');
    }

    updateGameStatus(gameState);

    UI.PLAY_AREA.replaceChildren(
      currentPlayer(gameState.currentPlayer),
      ...Object.values(gameState.players).map((player) =>
        otherPlayer(player, gameState),
      ),
    );

    // Update timer from game state if available
    if (gameState.turnInfo && gameState.turnInfo.secondsLeft > 0) {
      updateTurnTimer(gameState.turnInfo.secondsLeft, gameState.turnInfo.totalSeconds);
    }
  });

  socket.on(`game:${gameId}:error`, ({ error }: { error: string }) => {
    const errDiv = document.createElement("div");
    errDiv.classList.add("error", "message");
    errDiv.textContent = error;

    UI.CHAT_MESSAGES.appendChild(errDiv);
  });

  socket.on(`game:${gameId}:timer-update`, (timerData: { secondsLeft: number, totalSeconds: number }) => {
    updateTurnTimer(timerData.secondsLeft, timerData.totalSeconds);
  });

  socket.on(`game:${gameId}:timer-sync`, (data: { userId: number, secondsLeft: number, totalSeconds: number }) => {
    updateTurnTimer(data.secondsLeft, data.totalSeconds);
  });

};