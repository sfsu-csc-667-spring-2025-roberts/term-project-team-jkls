import db from "../connection";

export const updateBalance = async (
  gameId: number, 
  userId: number, 
  amount: number
) => {
  return db.none(
    `UPDATE game_users 
     SET balance = balance + $3 
     WHERE game_id = $1 AND user_id = $2`,
    [gameId, userId, amount]
  );
};