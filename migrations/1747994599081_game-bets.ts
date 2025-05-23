import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.addColumns("game_users", {
    balance: { type: "integer", notNull: true, default: 10000 },
    last_refill: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("NOW()"),
    },
  });

  pgm.createTable("game_bets", {
    id: { type: "serial", primaryKey: true },
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
    amount: { type: "integer", notNull: true, default: 0 },
    round: { type: "integer", notNull: true, default: 1 },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("NOW()"),
    },
  });

  pgm.createIndex("game_bets", ["game_id", "user_id", "round"]);

  pgm.addColumns("games", {
    current_bet: { type: "integer", notNull: true, default: 0 },
    current_round: { type: "integer", notNull: true, default: 1 },
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropColumns("games", ["current_bet", "current_round"]);
  pgm.dropTable("game_bets");
  pgm.dropColumns("game_users", ["balance", "last_refill"]);
}
