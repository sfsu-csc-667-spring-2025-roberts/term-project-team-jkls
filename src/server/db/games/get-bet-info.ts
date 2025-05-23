import db from "../connection";

export const getBetInfo = async (gameId: number) => {
  const { current_bet, current_round } = await db.one(
    `SELECT current_bet, current_round FROM games WHERE id = $1`,
    [gameId]
  );

  const playerBets = await db.manyOrNone(
    `SELECT user_id, amount FROM game_bets 
     WHERE game_id = $1 AND round = $2`,
    [gameId, current_round]
  ).then(rows => {
    const bets: Record<string, number> = {};
    rows.forEach(row => {
      bets[row.user_id] = parseInt(row.amount);
    });
    return bets;
  });

  return {
    currentBet: parseInt(current_bet),
    currentRound: parseInt(current_round),
    playerBets
  };
};