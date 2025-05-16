import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.addColumn("users", {
    username: { type: "varchar(32)" },
  });

  pgm.sql(`
    UPDATE users
       SET username = lower(split_part(email, '@', 1))
     WHERE username IS NULL
  `);


  pgm.alterColumn("users", "username", { notNull: true });


  pgm.addConstraint(
    "users",
    "users_username_unique",
    "UNIQUE(username)"
  );

  pgm.addConstraint(
    "users",
    "users_username_valid_chars",
    "CHECK (username ~ '^[A-Za-z0-9_]+$')"
  );
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropConstraint("users", "users_username_valid_chars");
  pgm.dropConstraint("users", "users_username_unique");
  pgm.dropColumn("users", "username");
}
