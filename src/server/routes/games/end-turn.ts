import { Request, Response } from "express";
import { Game } from "../../db";
import { endTurn } from "../../services/turn-timer";

export const endCurrentTurn = async (request: Request, response: Response) => {
  const { gameId } = request.params;
  // @ts-ignore
  const { id: userId } = request.session.user!;
  
  try {
    console.log(`🔄 [MANUAL END] User ${userId} trying to end turn for game ${gameId}`);
    
    const players = await Game.getPlayers(parseInt(gameId));
    const currentPlayer = players.find(p => p.is_current);
    
    console.log(`🎯 [MANUAL END] Current player:`, currentPlayer);
    console.log(`👤 [MANUAL END] Requesting user:`, userId);
    
    if (!currentPlayer || currentPlayer.id !== userId) {
      console.log(`❌ [MANUAL END] Not your turn - current: ${currentPlayer?.id}, requesting: ${userId}`);
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