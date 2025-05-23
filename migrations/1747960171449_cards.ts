import { MigrationBuilder } from "node-pg-migrate";
import fs from "fs";
import path from "path";

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createType("card_suit", ["clubs", "diamonds", "hearts", "spades"]);
  pgm.createType("card_rank", [
    "2", "3", "4", "5", "6", "7", "8", "9", "10",
    "jack", "queen", "king", "ace",
  ]);

  pgm.createTable("cards", {
    id: "id",
    suit: { type: "card_suit", notNull: true },
    rank: { type: "card_rank", notNull: true },
    image_url: { type: "text", notNull: true },
  });
  pgm.addConstraint("cards", "cards_unique_suit_rank", {
    unique: ["suit", "rank"],
  });

  const imgDir = path.resolve(__dirname, "..", "public", "assets", "card-images");
  const files = fs.readdirSync(imgDir).filter((f) => f.endsWith(".png"));

  const cards = files
    .map((file) => {
      const m = file.match(/^([a-z0-9]+)_of_([a-z]+)(\d*)\.png$/i);
      if (!m) return null;

      const [, rankRaw, suitRaw] = m;
      return {
        rank: rankRaw.toLowerCase(),
        suit: suitRaw.toLowerCase(),
        image_url: `/assets/card-images/${file}`,
      };
    })
    .filter(Boolean) as { rank: string; suit: string; image_url: string }[];

  if (cards.length !== 52) {
    throw new Error(
      `Expected 52 card images, but found ${cards.length}. Check public/assets/card-images/`,
    );
  }

  const values = cards
    .map(
      (c) =>
        `('${c.suit}'::card_suit,'${c.rank}'::card_rank,'${c.image_url}')`,
    )
    .join(",\n");

  pgm.sql(`INSERT INTO cards (suit, rank, image_url) VALUES ${values};`);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable("cards");
  pgm.dropType("card_suit");
  pgm.dropType("card_rank");
}
