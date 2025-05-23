import { DbGameUser, User } from "global";
import db from "../connection";

export const SQL = `
SELECT users.id, users.email, users.username, game_users.*
FROM users, game_users 
WHERE users.id=game_users.user_id
AND game_users.game_id=$1
ORDER BY seat ASC`;

export const getPlayers = async (
  gameId: number,
): Promise<(User & DbGameUser)[]> => {
  const players = await db.many(SQL, gameId);
  return players;
};