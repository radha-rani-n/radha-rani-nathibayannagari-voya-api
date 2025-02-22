import fs from "fs";
import type { Request, Response } from "express";
import express from "express";
const router = express.Router();
import axios from "axios";
import knex from "knex";
import config from "../client/knexfile";
import { getAuth } from "@clerk/express";
const API_KEY = process.env.API_KEY;
const knexapp = knex(config);
interface SearchQueryParams {
  q: string;
  limit: number;
  token: string;
  input: string;
}

interface googleResponse {
  html_attributions: [];
  next_page_token: string;
  results: {
    formatted_address: string;
    geometry: {};
    name: string;
    place_id: string;
    icon: string;
  }[];
}
const API_URL = "https://places.googleapis.com/v1/places:searchText";

const API_AUTO_COMPLETE_URL =
  "https://places.googleapis.com/v1/places:autocomplete";

const getAutoCompleteResults = async (query: string) => {
  const { data } = await axios.post<{ suggestions: [] }>(
    API_AUTO_COMPLETE_URL,
    { input: query, includedPrimaryTypes: "(regions)" },
    {
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": API_KEY,
      },
    }
  );

  console.log(data);

  return data.suggestions;
};
