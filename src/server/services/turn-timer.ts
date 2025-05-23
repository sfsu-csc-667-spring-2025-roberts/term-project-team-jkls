import { Server } from "socket.io";
import { Game } from "../db";
import { broadcastGameStateToAll } from "../routes/games/broadcast-game-state";
import db from "../db/connection";

const activeTimers: Map<number, NodeJS.Timeout> = new Map();

export const startTurnTimer = async (gameId: number, io: Server): Promise<void> => {
  clearTurnTimer(gameId);
  
  const TURN_DURATION = 45;
  let secondsLeft = TURN_DURATION;
  
  console.log(`🎯 Starting timer for game ${gameId}`);
  
  // Update database with timer info
  await db.none(`
    UPDATE games 
    SET turn_start_time = NOW(), turn_duration = $2 
    WHERE id = $1
  `, [gameId, TURN_DURATION]);
  
  const timerInterval = setInterval(async () => {
    secondsLeft--;
        
    // Check sockets in room
    const sockets = await io.in(`game:${gameId}`).fetchSockets();
    
    // Emit timer update
    io.to(`game:${gameId}`).emit(`game:${gameId}:timer-update`, {
      secondsLeft,
      totalSeconds: TURN_DURATION
    });
    
    if (secondsLeft <= 0) {
      clearInterval(timerInterval);
      activeTimers.delete(gameId);
      console.log(`⏰ Timer expired for game ${gameId}, ending turn...`);
      
      await endTurn(gameId, io);
    }
  }, 1000);
  
  activeTimers.set(gameId, timerInterval);
  console.log(`✅ Timer started for game ${gameId}`);
};

export const endTurn = async (gameId: number, io: Server): Promise<void> => {
  clearTurnTimer(gameId);
  
  console.log(`🔄 [END TURN] Ending turn for game ${gameId}`);
  
  const players = await Game.getPlayers(gameId);
  
  const currentPlayerIndex = players.findIndex(p => p.is_current);
  
  if (currentPlayerIndex === -1) {
    console.log(`❌ [END TURN] No current player found!`);
    return;
  }
  
  const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
  const nextPlayer = players[nextPlayerIndex];
    
  await Game.setCurrentPlayer(gameId, nextPlayer.id);
    
  // Start the next turn timer
  await startTurnTimer(gameId, io);
  
  // Broadcast the updated game state
  await broadcastGameStateToAll(gameId, io);
  
};

export const clearTurnTimer = (gameId: number): void => {
  const timer = activeTimers.get(gameId);
  if (timer) {
    clearInterval(timer);
    activeTimers.delete(gameId);
  }
};