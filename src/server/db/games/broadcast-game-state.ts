import { Server } from "socket.io";
import { OtherPlayerInfo, PlayerGameState } from "global";
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
    players,
    buildPiles: gameState.buildPiles,
    currentBet: gameState.currentBet,
    currentRound: gameState.currentRound,
    turnInfo: gameState.turnInfo
  };

  io.to(userIdStr).emit(`game:${gameId}:updated`, playerGameState);
};