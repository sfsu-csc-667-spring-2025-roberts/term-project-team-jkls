import { Request, Response } from "express";
import { Game } from "../../db";
import { broadcastGameStateToPlayer } from "./broadcast-game-state";

export const ping = async (request: Request, response: Response) => {
  const { gameId } = request.params;
  // @ts-ignore
  const { id: userId } = request.session.user!;
  
  const hasStarted = await Game.hasStarted(parseInt(gameId));
  
  if (hasStarted) {
    const io = request.app.get("io");
    await broadcastGameStateToPlayer(parseInt(gameId), userId.toString(), io);
    
    // Get current timer state
    const gameState = await Game.getState(parseInt(gameId));
    const timerData = {
      secondsLeft: gameState.turnInfo.secondsLeft,
      totalSeconds: gameState.turnInfo.totalSeconds
    };
        
    // If timer has expired, auto-end the turn
    if (timerData.secondsLeft <= 0) {
      const { endTurn } = await import("../../services/turn-timer");
      await endTurn(parseInt(gameId), io);
      
      // Get updated game state after turn end
      const updatedGameState = await Game.getState(parseInt(gameId));
      const updatedTimerData = {
        secondsLeft: updatedGameState.turnInfo.secondsLeft,
        totalSeconds: updatedGameState.turnInfo.totalSeconds
      };
      
      // Broadcast updated state to all players
      const { broadcastGameStateToAll } = await import("./broadcast-game-state");
      await broadcastGameStateToAll(parseInt(gameId), io);
      
      io.to(userId.toString()).emit(`game:${gameId}:timer-update`, updatedTimerData);
    } else {
      io.to(userId.toString()).emit(`game:${gameId}:timer-update`, timerData);
      io.to(`game:${gameId}`).emit(`game:${gameId}:timer-sync`, {
        userId,
        ...timerData
      });
    }
  }

  response.sendStatus(200);
};