import { Server } from "socket.io";
import { OtherPlayerInfo, PlayerGameState, PlayerInfo } from "global";
import { getState } from "./get-state";

export const broadcastGameState = async (
  gameId: number, 
  userId: number, 
  io: Server
): Promise<void> => {
  const gameState = await getState(gameId);
  const userIdStr = userId.toString();
  
  const currentPlayer = gameState.players[userIdStr];

  if (currentPlayer === undefined) {
    console.log(`❌ [BROADCAST] Player ${userId} not found in game state`);
    return;
  }

  // Find who has the current turn - handle undefined case
  const currentTurnPlayer = Object.values(gameState.players).find(p => p.isCurrent);
  
  if (!currentTurnPlayer) {
    return;
  }

  const players: Record<string, OtherPlayerInfo> = {};
  Object.keys(gameState.players)
    .filter((key) => key !== userIdStr)
    .forEach((key) => {
      const { hand, ...rest } = gameState.players[key];
      players[key] = {
        ...rest,
        handCount: hand?.length || 0,
      };
    });

  const playerGameState: PlayerGameState = {
    currentPlayer,
    currentTurnPlayer,
    players,
    buildPiles: gameState.buildPiles,
    currentBet: gameState.currentBet,
    currentRound: gameState.currentRound,
    turnInfo: gameState.turnInfo
  };


  io.to(userIdStr).emit(`game:${gameId}:updated`, playerGameState);
};