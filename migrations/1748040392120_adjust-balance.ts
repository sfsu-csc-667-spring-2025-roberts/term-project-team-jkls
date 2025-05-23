import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.addColumns("users", {
    balance: { type: "integer", notNull: true, default: 10000 },
    last_refill: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("NOW()"),
    },
  });

  pgm.sql(`
    UPDATE users 
    SET balance = COALESCE(
      (SELECT MAX(balance) FROM game_users WHERE user_id = users.id), 
      10000
    )
  `);

  pgm.dropColumns("game_users", ["balance", "last_refill"]);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.addColumns("game_users", {
    balance: { type: "integer", notNull: true, default: 10000 },
    last_refill: {
      type: "timestamp", 
      notNull: true,
      default: pgm.func("NOW()"),
    },
  });

  pgm.sql(`
    UPDATE game_users 
    SET balance = (SELECT balance FROM users WHERE id = game_users.user_id)
  `);

  pgm.dropColumns("users", ["balance", "last_refill"]);
}