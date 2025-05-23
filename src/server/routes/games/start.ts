import { Request, Response } from "express";
import { Game } from "../../db";
import { broadcastGameStateToAll } from "./broadcast-game-state";
import { startTurnTimer } from "../../services/turn-timer";

export const start = async (request: Request, response: Response) => {
  const { gameId } = request.params;
  // @ts-ignore
  const { id: userId } = request.session.user!;

  try {
    const hasStarted = await Game.hasStarted(parseInt(gameId));
    if (hasStarted) {
      return response.status(400).send("Game has already started");
    }

    const hostId = await Game.getHost(parseInt(gameId));
    if (hostId !== userId) {
      return response.status(400).send("Only the host can start the game");
    }

    console.log(`🚀 Starting game ${gameId}...`);
    await Game.start(parseInt(gameId));

    const io = request.app.get("io");

    console.log(`📡 Broadcasting initial game state...`);
    await broadcastGameStateToAll(parseInt(gameId), io);
    
    console.log(`⏰ Starting turn timer...`);
    await startTurnTimer(parseInt(gameId), io);

    return response.sendStatus(200);
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Server error");
  }
};