import { Request, Response } from "express";  // Make sure these are from express
import { Game } from "../../db";

export const validatePassword = async (request: Request, response: Response) => {
  const { gameId } = request.params;
  const { password } = request.body;

  try {
    const game = await Game.getInfo(parseInt(gameId));
    
    if (!game) {
      return response.status(404).json({ valid: false });
    }
    
    const isValid = !game.password || game.password.trim() === password;
    
    response.json({ valid: isValid });
  } catch (error) {
    console.error("Password validation error:", error);
    response.status(500).json({ valid: false, error: "Server error" });
  }
};