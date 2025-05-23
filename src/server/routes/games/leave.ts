import { Request, Response } from "express";
import { Game } from "../../db";

export const leave = async (request: Request, response: Response) => {
  const { gameId } = request.params;
  // @ts-ignore
  const userId = request.session.user!.id;

  try {
    const hasStarted = await Game.hasStarted(parseInt(gameId));
    
    if (hasStarted) {
      return response.redirect(`/games/${gameId}`);
    }

    const hostId = await Game.getHost(parseInt(gameId));
    
    if (hostId === userId) {
      return response.redirect(`/games/${gameId}`);
    }

    await Game.removePlayer(parseInt(gameId), userId);
    
    const io = request.app.get("io");
    console.log(`Broadcasting player left event to game:${gameId}`);
    
    const sockets = await io.in(`game:${gameId}`).fetchSockets();
    
    io.to(`game:${gameId}`).emit(`game:${gameId}:player-left`, { 
      userId,
      timestamp: new Date(),
      message: `Player has left the game`
    });

    io.in(request.sessionID).socketsLeave(`game:${gameId}`);

    await Game.deleteEmptyGame(parseInt(gameId));


    return response.redirect('/lobby');
  } catch (error) {
    console.error("Error leaving game:", error);
    return response.redirect(`/games/${gameId}`);
  }
};