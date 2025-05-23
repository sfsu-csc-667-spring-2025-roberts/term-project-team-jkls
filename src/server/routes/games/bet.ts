import { Request, Response } from "express";
import { Game } from "../../db";
import db from "../../db/connection";
import { broadcastGameStateToPlayer } from "./broadcast-game-state";
import { updateBalance } from "../../db/games/update-balance";

export const bet = async (request: Request, response: Response) => {
  const { gameId } = request.params;
  const { amount } = request.body;
  // @ts-ignore
  const userId = request.session.user!.id;
  
  try {
    const players = await Game.getPlayers(parseInt(gameId));
    const currentPlayer = players.find(p => p.is_current);
    
    if (!currentPlayer || currentPlayer.id !== userId) {
      return response.status(400).json({ 
        success: false, 
        error: "Not your turn" 
      });
    }
    
    const { balance } = await db.one(
      `SELECT balance FROM game_users WHERE game_id = $1 AND user_id = $2`,
      [gameId, userId]
    );
    
    if (parseInt(balance) < amount) {
      return response.status(400).json({ 
        success: false, 
        error: "Insufficient balance" 
      });
    }
    
    await updateBalance(parseInt(gameId), userId, -amount);
    
    await db.none(
      `UPDATE games
       SET current_bet = $2
       WHERE id = $1`,
      [gameId, amount]
    );
    
    await db.none(
      `INSERT INTO game_bets (game_id, user_id, amount, round)
       VALUES ($1, $2, $3, (SELECT current_round FROM games WHERE id = $1))`,
      [gameId, userId, amount]
    );
    
    const io = request.app.get("io");
    io.to(`game:${gameId}`).emit(`game:${gameId}:bet`, {
      userId,
      amount,
      timestamp: new Date()
    });
    
    await Promise.all(
      players.map(player => 
        broadcastGameStateToPlayer(parseInt(gameId), `${player.id}`, io)
      )
    );
    
    return response.json({ 
      success: true, 
      message: "Bet placed successfully" 
    });
    
  } catch (error) {
    console.error("Error placing bet:", error);
    return response.status(500).json({ 
      success: false, 
      error: "Internal server error" 
    });
  }
};