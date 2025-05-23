import { Request, Response } from "express";
import { Game } from "../../db";

export const create = async (request: Request, response: Response) => {
    // @ts-ignore
    const { id: userId } = request.session.user!;
    const { description, minPlayers, maxPlayers, password } = request.body;

  try {
    const gameId = await Game.create(
      description,
      minPlayers,
      maxPlayers,
      password,
      userId,
    );

    request.app.get("io").socketsJoin(`game:${gameId}`);

    response.redirect(`/games/${gameId}`);
  } catch (error) {
    console.log({ error });

    response.redirect("/lobby");
  }
};