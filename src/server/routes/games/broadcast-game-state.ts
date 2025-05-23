import { Server } from "socket.io";
import { Game } from "../../db";

interface OtherPlayerInfo {
  id: number;
  username: string;
  email: string;
  seat: number;
  isCurrent: boolean;
  handCount: number;
  stockPileCount: number;
  discardPiles: any[];
  stockPileTop: any;
  balance: number;
}

interface PlayerGameState {
  currentPlayer: any;
  currentTurnPlayer: any;
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

  // Find who has the current turn
  const currentTurnPlayer = Object.values(gameState.players).find(p => p.isCurrent);

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
    currentTurnPlayer,
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