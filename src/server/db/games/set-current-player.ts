import db from "../connection";

export const SQL = `
UPDATE game_users 
SET is_current = (game_users.user_id = $2)
WHERE game_id = $1`;

export const setCurrentPlayer = async (gameId: number, userId: number) => {
  console.log(`🎯 [SET CURRENT] Setting current player for game ${gameId} to user ${userId}`);
  
  const result = await db.result(SQL, [gameId, userId]);
  console.log(`📝 [SET CURRENT] Updated ${result.rowCount} rows`);
  
  // Verify the update worked
  const verification = await db.many(
    `SELECT user_id, is_current FROM game_users WHERE game_id = $1`,
    [gameId]
  );
  console.log(`✅ [SET CURRENT] Current state:`, verification);
};