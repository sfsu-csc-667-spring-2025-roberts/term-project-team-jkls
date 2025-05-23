import { Request, Response } from "express";
import { Game } from "../../db";

export const join = async (request: Request, response: Response) => {
  const { gameId } = request.params;
  const { password } = request.body;
  // @ts-ignore
  const { id: userId } = request.session.user!;

  try {
    await Game.join(userId, parseInt(gameId), password);

    request.app.get("io").socketsJoin(`game:${gameId}`);

    const io = request.app.get("io");
    io.to(`game:${gameId}`).emit(`game:${gameId}:player-joined`, {
      userId,
      timestamp: new Date()
    });

    response.redirect(`/games/${gameId}`);
  } catch (error) {
    console.log({ error });

    response.redirect("/lobby");
  }
};