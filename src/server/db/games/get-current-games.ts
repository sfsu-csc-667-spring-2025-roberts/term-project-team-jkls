import db from "../connection";

const SQL = `
SELECT games.*, (
  SELECT COUNT(*) FROM game_users WHERE game_users.game_id=games.id
)::int as player_count 
FROM games, game_users
WHERE games.id=game_users.game_id 
AND game_users.user_id=$1
`;

export const getCurrentGames = async (userId: number) => {
  return db.any(SQL, [userId]);
};