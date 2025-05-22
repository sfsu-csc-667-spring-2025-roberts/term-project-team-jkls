import { Game } from "../../db";

export const getPlayerGames = async (userId: number) => {
  const availableGames = await Game.getAvailableGames(userId);
  const currentGames = await Game.getCurrentGames(userId);

  return { availableGames, currentGames };
};