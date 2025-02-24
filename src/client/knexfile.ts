import dotenv from "dotenv";

import knex from "knex";

dotenv.config({ path: "../../.env" });

const config: knex.Knex.Config = {
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
  migrations: {
    directory: "../../migrations",
  },
  seeds: {
    directory: "../../seeds",
  },
};

export default config;
