import { Request, Response } from "express";
import { Game } from "../../db";
import { endTurn } from "../../services/turn-timer";

export const endCurrentTurn = async (request: Request, response: Response) => {
  const { gameId } = request.params;
  // @ts-ignore
  const { id: userId } = request.session.user!;
  
  try {    
    const players = await Game.getPlayers(parseInt(gameId));
    const currentPlayer = players.find(p => p.is_current);
    
    if (!currentPlayer || currentPlayer.id !== userId) {
      return response.status(400).json({ 
        success: false, 
        error: "Not your turn" 
      });
    }
    
    const io = request.app.get("io");
    await endTurn(parseInt(gameId), io);
    
    return response.json({ 
      success: true, 
      message: "Turn ended" 
    });
  } catch (error) {
    console.error("Error ending turn:", error);
    return response.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
};