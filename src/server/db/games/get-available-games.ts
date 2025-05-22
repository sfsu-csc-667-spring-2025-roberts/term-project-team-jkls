import db from "../connection";

const SQL = `
SELECT *, (
  SELECT COUNT(*) FROM game_users WHERE game_users.game_id=games.id
)::int as player_count 
FROM game_users, games 
WHERE game_users.game_id=games.id
AND $1 NOT IN (
  SELECT user_id 
  FROM game_users 
  WHERE games.id=game_users.game_id
)`;

export const getAvailableGames = async (userId: number) => {
 
  const games = await db.any(SQL, [userId]);

  return db.any(SQL, [userId]);
};