import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable("game_cards", {
    game_id: {
      type: "integer",
      notNull: true,
      references: "games",
      onDelete: "CASCADE",
    },
    user_id: {
      type: "integer",
      notNull: true,
      references: "users",
      onDelete: "CASCADE",
    },
    card_id: {
      type: "integer",
      notNull: true,
      references: "cards",
      onDelete: "CASCADE",
    },
    card_order: {
      type: "integer",
      notNull: true,
    },
    pile: {
      type: "integer",
      notNull: true,
    },
  });

  pgm.createIndex("game_cards", ["game_id", "pile"]);
  pgm.createIndex("game_cards", ["game_id", "user_id", "pile"]);


  pgm.sql(`
    CREATE VIEW card_instances AS
    SELECT * FROM game_cards;
  `);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  /* Drop the view first (it depends on the table) */
  pgm.sql(`DROP VIEW IF EXISTS card_instances;`);
  pgm.dropTable("game_cards");
}
