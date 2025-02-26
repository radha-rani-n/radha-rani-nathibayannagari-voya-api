import dotenv from "dotenv";

import knex from "knex";

dotenv.config({ path: "../../.env" });

const config: knex.Knex.Config = {
  client: "pg",
  connection: {
    host: process.env.PG_DB_HOST,
    port: process.env.PG_DB_PORT ? +process.env.PG_DB_PORT : 5432,
    database: process.env.PG_DB_NAME,
    user: process.env.PG_DB_USER,
    password: process.env.PG_DB_PASSWORD,
  },
  migrations: {
    directory: "../../migrations",
  },
  seeds: {
    directory: "../../seeds",
  },
};
const supabaseConfig: knex.Knex.Config = {
  client: "pg",
  connection: {
    connectionString: process.env.PG_SUPABASE_CONNECTION_STRING,
  },
  migrations: {
    directory: "../../migrations",
  },
  seeds: {
    directory: "../../seeds",
  },
};

export default supabaseConfig;
