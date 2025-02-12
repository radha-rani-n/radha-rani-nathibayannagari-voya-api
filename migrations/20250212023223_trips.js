/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable("trips", (table) => {
    table.increments("id").primary();
    table.string("trip_name").notNullable();
    table.string("place_name").notNullable();
    table.date("from_date").notNullable();
    table.date("to_date").notNullable();
    table.string("no_of_travellers").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table
      .timestamp("updated_at")
      .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export function down(knex) {
  return knex.schema.dropTable("trips");
}
