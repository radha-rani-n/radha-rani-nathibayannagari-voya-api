import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("trips_places").del();
  await knex("trips").del();
  await knex("places").del();
}
