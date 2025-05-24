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

    await Game.start(parseInt(gameId));

    const io = request.app.get("io");

    await broadcastGameStateToAll(parseInt(gameId), io);
    
    await startTurnTimer(parseInt(gameId), io);

    return response.sendStatus(200);
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Server error");
  }
};