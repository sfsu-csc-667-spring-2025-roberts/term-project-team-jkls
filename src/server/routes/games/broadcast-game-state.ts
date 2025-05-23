import { Server } from "socket.io";
import { Game } from "../../db";

interface OtherPlayerInfo {
  handCount: number;
  // Add other properties as needed
}

interface PlayerGameState {
  currentPlayer: any;
  players: Record<string, OtherPlayerInfo>;
  buildPiles: any;
  currentBet: number;
  currentRound: number;
  turnInfo: any;
}

export const broadcastGameStateToPlayer = async (
  gameId: number,
  userId: string,
  io: Server
): Promise<void> => {
  const gameState = await Game.getState(gameId);
  
  const currentPlayer = gameState.players[userId];

  if (currentPlayer === undefined) {
    return;
  }

  const players: Record<string, OtherPlayerInfo> = {};
  Object.keys(gameState.players)
    .filter((key) => key !== userId)
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

  io.to(userId).emit(`game:${gameId}:updated`, playerGameState);
};

export const broadcastGameStateToAll = async (
  gameId: number,
  io: Server
): Promise<void> => {
  const gameState = await Game.getState(gameId);
  
  for (const userId of Object.keys(gameState.players)) {
    await broadcastGameStateToPlayer(gameId, userId, io);
  }
};