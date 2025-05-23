import { Request, Response } from "express";
import { Game } from "../../db";
import db from "../../db/connection";

export const deleteGame = async (request: Request, response: Response) => {
  const { gameId } = request.params;
  // @ts-ignore
  const { id: userId, username } = request.session.user!;

  try {
    const hasStarted = await Game.hasStarted(parseInt(gameId));
    
    if (hasStarted) {
      return response.status(400).json({
        success: false, 
        message: "Cannot delete a game that has already started"
      });
    }

    const hostId = await Game.getHost(parseInt(gameId));
    
    if (hostId !== userId) {
      return response.status(403).json({
        success: false, 
        message: "Only the host can delete the game"
      });
    }

    await db.none(`DELETE FROM game_users WHERE game_id = $1`, [gameId]);
    
    await db.none(`DELETE FROM games WHERE id = $1`, [gameId]);
    
    const io = request.app.get("io");
    io.to(`game:${gameId}`).emit(`game:${gameId}:deleted`, { 
      message: "Game has been deleted by the host"
    });
    
    io.in(`game:${gameId}`).socketsLeave(`game:${gameId}`);

    return response.json({
      success: true,
      message: "Game deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting game:", error);
    return response.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};