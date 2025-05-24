import db from "../connection";

export const SQL = `
UPDATE game_users 
SET is_current = (game_users.user_id = $2)
WHERE game_id = $1`;

export const setCurrentPlayer = async (gameId: number, userId: number) => {  
  const result = await db.result(SQL, [gameId, userId]);
  
  const verification = await db.many(
    `SELECT user_id, is_current FROM game_users WHERE game_id = $1`,
    [gameId]
  );
};