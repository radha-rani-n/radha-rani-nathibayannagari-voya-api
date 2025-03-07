/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex: any): any {
  return knex.schema
    .createTable("trips", (table: any) => {
      table.increments("trip_id").primary();
      table.string("trip_name").notNullable();
      table.string("place_name").notNullable();
      table.date("from_date").notNullable();
      table.date("to_date").notNullable();
      table.string("no_of_travellers").notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table
        .timestamp("updated_at")
        .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
      table.string("user_id").notNullable();
    })
    .createTable("places", (table: any) => {
      table.string("place_id").primary();
      table.string("place_name").notNullable();
      table.string("latitude").notNullable();
      table.string("longitude").notNullable();
      table.string("photo_reference");

      table.timestamp("created_at").defaultTo(knex.fn.now());
      table
        .timestamp("updated_at")
        .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
    })
    .createTable("trips_places", (table: any) => {
      table
        .integer("trip_id")
        .unsigned()
        .references("trips.trip_id")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table
        .string("place_id")
        .references("places.place_id")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table.string("user_id");

      table.timestamp("created_at").defaultTo(knex.fn.now());
      table
        .timestamp("updated_at")
        .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));

      table.primary(["trip_id", "place_id"]);
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export function down(knex: any): any {
  return knex.schema
    .dropTable("trips_places")
    .dropTable("trips")
    .drop("places");
}
