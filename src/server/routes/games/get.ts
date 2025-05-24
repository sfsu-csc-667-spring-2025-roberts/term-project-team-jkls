import { Request, Response } from "express";
import { Game } from "../../db";
import { broadcastGameStateToPlayer } from "./broadcast-game-state";

export const get = async (request: Request, response: Response) => {
  const { gameId } = request.params;
  // @ts-ignore
  const { id: userId } = request.session.user!;
  
  try {
    request.app.get("io").in(request.sessionID).socketsJoin(`game:${gameId}`);

    const hasStarted = await Game.hasStarted(parseInt(gameId));
    const gameInfo = await Game.getInfo(parseInt(gameId));
    const players = await Game.getPlayers(parseInt(gameId));
    const hostId = await Game.getHost(parseInt(gameId));
    
    const isHost = hostId === userId;
    
    response.render("games", {
      hasStarted,
      isHost,
      min_players: gameInfo.min_players,
      players,
      hostId,
      gameId
    });
    
    if (hasStarted) {
      const io = request.app.get("io");
      
      setTimeout(async () => {        
        await broadcastGameStateToPlayer(parseInt(gameId), userId.toString(), io);
        
        const gameState = await Game.getState(parseInt(gameId));
        const timerData = {
          secondsLeft: gameState.turnInfo.secondsLeft,
          totalSeconds: gameState.turnInfo.totalSeconds
        };
                
        if (timerData.secondsLeft <= 0) {
          const { endTurn } = await import("../../services/turn-timer");
          await endTurn(parseInt(gameId), io);
          
          const { broadcastGameStateToAll } = await import("./broadcast-game-state");
          await broadcastGameStateToAll(parseInt(gameId), io);
        } else {
          io.to(userId.toString()).emit(`game:${gameId}:timer-update`, timerData);
          io.to(`game:${gameId}`).emit(`game:${gameId}:timer-sync`, {
            userId,
            ...timerData
          });
        }
        
      }, 2000);
    }
    
  } catch (error) {
    console.error('Error in get route:', error);
    response.redirect("/lobby");
  }
};