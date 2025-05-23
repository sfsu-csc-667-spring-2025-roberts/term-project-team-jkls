import db from "../connection";

export const removePlayer = async (gameId: number, userId: number) => {
  return db.none(
    `DELETE FROM game_users WHERE game_id = $1 AND user_id = $2`,
    [gameId, userId]
  );
};