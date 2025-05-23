import { Request, Response } from "express";
import { Game } from "../../db";

export const get = async (request: Request, response: Response) => {
  const { gameId } = request.params;
  // @ts-ignore
  const { id: userId } = request.session.user!;
  
  try {
    request.app.get("io").in(request.sessionID).socketsJoin(`game:${gameId}`);

    const hasStarted = await Game.hasStarted(parseInt(gameId));
    const gameInfo = await Game.getInfo(parseInt(gameId));
    const players = await Game.getPlayers(parseInt(gameId));
    const hostId = await Game.getHost(parseInt(gameId));
    
    const isHost = hostId === userId;
    
    response.render("games", {
      hasStarted,
      isHost,
      min_players: gameInfo.min_players,
      players,
      hostId,
      gameId
    });
  } catch (error) {
    console.error(error);
    response.redirect("/lobby");
  }
};