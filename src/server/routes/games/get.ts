import { Request, Response } from "express";
import { Game } from "../../db";
import { broadcastGameStateToPlayer } from "./broadcast-game-state";

export const get = async (request: Request, response: Response) => {
  const { gameId } = request.params;
  // @ts-ignore
  const { id: userId } = request.session.user!;
  
  try {
    // Make sure the session joins the game room
    request.app.get("io").in(request.sessionID).socketsJoin(`game:${gameId}`);

    const hasStarted = await Game.hasStarted(parseInt(gameId));
    const gameInfo = await Game.getInfo(parseInt(gameId));
    const players = await Game.getPlayers(parseInt(gameId));
    const hostId = await Game.getHost(parseInt(gameId));
    
    const isHost = hostId === userId;
    
    // Render the page first
    response.render("games", {
      hasStarted,
      isHost,
      min_players: gameInfo.min_players,
      players,
      hostId,
      gameId
    });
    
    // If game has started, send the current state after page loads
    if (hasStarted) {
      const io = request.app.get("io");
      
      // Wait longer for the client to fully load and configure socket events
      setTimeout(async () => {
        console.log(`📡 [GET] Sending game state to returning user ${userId} for game ${gameId}`);
        
        // Broadcast the current game state
        await broadcastGameStateToPlayer(parseInt(gameId), userId.toString(), io);
        
        // Get current timer state
        const gameState = await Game.getState(parseInt(gameId));
        const timerData = {
          secondsLeft: gameState.turnInfo.secondsLeft,
          totalSeconds: gameState.turnInfo.totalSeconds
        };
        
        console.log(`⏰ [GET] Sending timer data to user ${userId}:`, timerData);
        
        // Check if timer expired and handle it
        if (timerData.secondsLeft <= 0) {
          console.log(`🔄 [GET] Timer expired, auto-ending turn for game ${gameId}`);
          const { endTurn } = await import("../../services/turn-timer");
          await endTurn(parseInt(gameId), io);
          
          // Broadcast updated state
          const { broadcastGameStateToAll } = await import("./broadcast-game-state");
          await broadcastGameStateToAll(parseInt(gameId), io);
        } else {
          // Send timer update to both user's personal room AND game room
          io.to(userId.toString()).emit(`game:${gameId}:timer-update`, timerData);
          io.to(`game:${gameId}`).emit(`game:${gameId}:timer-sync`, {
            userId,
            ...timerData
          });
        }
        
      }, 2000); // Increased delay to ensure client is ready
    }
    
  } catch (error) {
    console.error('Error in get route:', error);
    response.redirect("/lobby");
  }
};