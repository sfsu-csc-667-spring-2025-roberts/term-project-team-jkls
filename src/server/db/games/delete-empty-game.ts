import db from "../connection";

export const deleteEmptyGame = async (gameId: number): Promise<boolean> => {
  const { player_count } = await db.one(
    `SELECT COUNT(user_id) as player_count FROM game_users WHERE game_id = $1`,
    [gameId]
  );
  
  if (parseInt(player_count) === 0) {
    await db.none(`DELETE FROM games WHERE id = $1`, [gameId]);
    console.log(`Game ${gameId} deleted - no players remaining`);
    return true;
  }
  
  return false;
};