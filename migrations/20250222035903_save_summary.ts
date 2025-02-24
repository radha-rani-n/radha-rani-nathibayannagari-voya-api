import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("location_summaries", (table: any) => {
    table.string("location_name").primary();
    table.text("location_summary").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("location_summaries");
}
