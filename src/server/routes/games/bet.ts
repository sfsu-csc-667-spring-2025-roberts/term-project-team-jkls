import { Request, Response } from "express";
import { Game } from "../../db";
import db from "../../db/connection";
import { broadcastGameStateToPlayer } from "./broadcast-game-state";
import { canAffordBet, updateUserBalance } from "../../services/balance-refill";

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
    
    // Check if user can afford the bet using account balance
    const canAfford = await canAffordBet(userId, amount);
    if (!canAfford) {
      return response.status(400).json({ 
        success: false, 
        error: "Insufficient balance" 
      });
    }
    
    // Deduct from user's account balance
    const newBalance = await updateUserBalance(userId, -amount);
    
    // Update game bet
    await db.none(
      `UPDATE games
       SET current_bet = $2
       WHERE id = $1`,
      [gameId, amount]
    );
    
    // Record the bet
    await db.none(
      `INSERT INTO game_bets (game_id, user_id, amount, round)
       VALUES ($1, $2, $3, (SELECT current_round FROM games WHERE id = $1))`,
      [gameId, userId, amount]
    );
    
    const io = request.app.get("io");
    io.to(`game:${gameId}`).emit(`game:${gameId}:bet`, {
      userId,
      amount,
      newBalance,
      timestamp: new Date()
    });
    
    // Broadcast updated game state to all players
    await Promise.all(
      players.map(player => 
        broadcastGameStateToPlayer(parseInt(gameId), `${player.id}`, io)
      )
    );
    
    return response.json({ 
      success: true, 
      message: "Bet placed successfully",
      newBalance
    });
    
  } catch (error) {
    console.error("Error placing bet:", error);
    return response.status(500).json({ 
      success: false, 
      error: "Internal server error" 
    });
  }
};