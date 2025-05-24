import { GameState, PlayerInfo } from "global";
import db from "../connection";
import { getBetInfo } from "./get-bet-info";

import {
  DISCARD_1,
  DISCARD_2,
  DISCARD_3,
  DISCARD_4,
  EAST_PILE,
  NORTH_PILE,
  PLAYER_HAND,
  SOUTH_PILE,
  STOCK_PILE,
  WEST_PILE,
} from "./constants";
import { getInfo } from "./get-info";
import { getPlayers } from "./get-players";

const rankToValue: Record<string, number> = {
  "2": 2, "3": 3, "4": 4, "5": 5,
  "6": 6, "7": 7, "8": 8, "9": 9, "10": 10,
  jack: 11, queen: 12, king: 13, ace: 1,
};

const normalizeCard = (raw: any) =>
  raw && {
    ...raw,
    value: rankToValue[raw.rank] ?? 0,
  };

const GET_CARD_SQL = `
SELECT cards.*, game_cards.card_order 
FROM cards, game_cards 
WHERE user_id=$(userId) 
  AND pile=$(pile) 
  AND game_id=$(gameId)
  AND cards.id=game_cards.card_id
ORDER BY game_cards.card_order, game_cards.card_id DESC
LIMIT $(limit)
`;

const GET_STOCKPILE_COUNT_SQL = `
SELECT COUNT(*) FROM game_cards
WHERE game_cards.user_id=$(userId)
  AND game_cards.game_id=$(gameId)
  AND pile=${STOCK_PILE}
`;

export const getState = async (gameId: number): Promise<GameState> => {
  const { name } = await getInfo(gameId);

  const players = (await getPlayers(gameId)).map(
    ({ id, email, username, seat, is_current: isCurrent }) => ({
      id,
      email,
      username,
      seat,
      isCurrent,
    }),
  );

  const betInfo = await getBetInfo(gameId);

  const playerInfo: Record<string, PlayerInfo> = {};

  for (let playerIndex = 0; playerIndex < players.length; playerIndex++) {
    const player = players[playerIndex];
    const { id: userId } = players[playerIndex];

    const { balance } = await db.one(
      `SELECT balance FROM users WHERE id = $1`,
      [userId]
    );

    const hand = await db.manyOrNone(GET_CARD_SQL, {
      gameId,
      userId,
      limit: 5,
      pile: PLAYER_HAND,
    }).then(rows => rows.map(normalizeCard));

    const stockPileTop = await db.oneOrNone(GET_CARD_SQL, {
      gameId,
      userId,
      limit: 1,
      pile: STOCK_PILE,
    });
    const { count: stockPileCount } = await db.one(GET_STOCKPILE_COUNT_SQL, {
      gameId,
      userId,
    });

    try {
      playerInfo[userId] = {
        ...player,
        hand,
        stockPileTop,
        stockPileCount: parseInt(stockPileCount),
        discardPiles: await Promise.all(
          [DISCARD_1, DISCARD_2, DISCARD_3, DISCARD_4].map((pile) =>
            db.any(GET_CARD_SQL, { gameId, userId, limit: 1, pile }).then((rows) => rows.map(normalizeCard)),
          ),
        ),
        balance: parseInt(balance),
        currentBet: betInfo.playerBets[userId] || 0,
      };
    } catch (error) {
      console.error({ error });
    }
  }

  return {
    name,
    buildPiles: await Promise.all(
      [NORTH_PILE, EAST_PILE, SOUTH_PILE, WEST_PILE].map((pile) => {
        return db.oneOrNone(GET_CARD_SQL, {
          gameId,
          pile,
          userId: 0,
          limit: 1,
        }).then(normalizeCard);
      }),
    ),
    players: playerInfo,
    currentBet: betInfo.currentBet,
    currentRound: betInfo.currentRound,
    totalPot: betInfo.totalPot,
    grandTotalPot: betInfo.grandTotalPot,
    turnInfo: await db.oneOrNone(
      `SELECT 
        turn_start_time, 
        turn_duration,
        EXTRACT(EPOCH FROM (NOW() - turn_start_time)) as elapsed_seconds
       FROM games WHERE id = $1`,
      [gameId]
    ).then(data => {
      if (!data) return { secondsLeft: 45, totalSeconds: 45 };
      
      const elapsedSeconds = Math.floor(parseFloat(data.elapsed_seconds));
      const secondsLeft = Math.max(0, data.turn_duration - elapsedSeconds);
      
      return {
        secondsLeft,
        totalSeconds: data.turn_duration,
        hasExpired: secondsLeft <= 0
      };
    })
  };
};