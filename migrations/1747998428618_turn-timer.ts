import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.addColumns("games", {
    turn_start_time: {
      type: "timestamp with time zone",
      default: pgm.func("NOW()"),
    },
    turn_duration: {
      type: "integer",
      notNull: true,
      default: 45,
    },
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropColumns("games", ["turn_start_time", "turn_duration"]);
}
