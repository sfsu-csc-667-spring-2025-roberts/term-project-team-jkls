import db from "../connection";
import {
  SHUFFLE_ME,
  NORTH_PILE,
  EAST_PILE,
  SOUTH_PILE,
  WEST_PILE,
} from "./constants";


const SQL = `
UPDATE game_cards
SET    user_id = $(userId),
       pile    = $(pile)
WHERE  game_id = $(gameId)
  AND  card_id IN (
        SELECT card_id
        FROM   game_cards
        WHERE  game_id = $(gameId)
          AND  user_id = 0
          AND  pile   != ${SHUFFLE_ME}
        ORDER  BY card_order, card_id
        LIMIT  $(cardCount)
      );
`;

/* ── 2. COUNT remaining cards in **this** game’s deck ───────────── */
const AVAILABLE_CARD_COUNT = `
SELECT COUNT(*)
FROM   game_cards
WHERE  game_id = $(gameId)
  AND  user_id = 0
  AND  pile NOT IN (
        ${SHUFFLE_ME}, ${NORTH_PILE}, ${EAST_PILE},
        ${SOUTH_PILE}, ${WEST_PILE}
  );
`;

/* rest of the file stays the same */
export const dealCards = async (
  userId: number,
  gameId: number,
  cardCount: number,
  pile: number,
) => {
  const { count } = await db.one(AVAILABLE_CARD_COUNT, { gameId });
  if (cardCount > count) {
    // TODO: shuffle logic
  }

  await db.none(SQL, { userId, gameId, cardCount, pile });
};
