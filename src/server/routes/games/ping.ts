import { Request, Response } from "express";
import { Game } from "../../db";
import { broadcastGameStateToPlayer } from "./broadcast-game-state";

export const ping = async (request: Request, response: Response) => {
  const { gameId } = request.params;
  // @ts-ignore
  const { id: userId } = request.session.user!;

    console.log(`🏓 [PING] User ${userId} pinging game ${gameId}`);
    
    const hasStarted = await Game.hasStarted(parseInt(gameId));
    
    if (hasStarted) {
      const io = request.app.get("io");
      
      console.log(`📡 [PING] Broadcasting game state to user ${userId}`);
      await broadcastGameStateToPlayer(parseInt(gameId), userId.toString(), io);
      
      // Send current timer state
      const gameState = await Game.getState(parseInt(gameId));
      const timerData = {
        secondsLeft: gameState.turnInfo.secondsLeft,
        totalSeconds: gameState.turnInfo.totalSeconds
      };
      
      console.log(`⏰ [PING] Sending timer data:`, timerData);
      
      io.to(userId.toString()).emit(`game:${gameId}:timer-update`, timerData);
      io.to(`game:${gameId}`).emit(`game:${gameId}:timer-sync`, {
        userId,
        ...timerData
      });
    }

};