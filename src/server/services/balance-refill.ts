import db from "../db/connection";

export const checkAndRefillBalances = async () => {
  const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  
  const usersToRefill = await db.manyOrNone(`
    SELECT game_id, user_id, balance, last_refill 
    FROM game_users
    WHERE balance < 10000 AND 
          NOW() - last_refill > interval '24 hours'
  `);
  
  for (const user of usersToRefill) {
    await db.none(`
      UPDATE game_users 
      SET balance = 10000,
          last_refill = NOW()
      WHERE game_id = $1 AND user_id = $2
    `, [user.game_id, user.user_id]);
    
    console.log(`Refilled balance for user ${user.user_id} in game ${user.game_id}`);
  }
};