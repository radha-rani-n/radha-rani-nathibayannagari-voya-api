import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("trips_places").del();
  await knex("trips").del();
  await knex("places").del();
}
