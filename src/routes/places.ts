import fs from "fs";
import type { Request, Response } from "express";
import express from "express";
const router = express.Router();
import axios from "axios";
import knex from "knex";
import config from "../client/knexfile";
import { v4 as uuidv4 } from "uuid";
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

const API_URL = "https://maps.googleapis.com/maps/api/place/textsearch/json";

const API_AUTO_COMPLETE_URL =
  "https://maps.googleapis.com/maps/api/place/autocomplete/json";
const getAutoCompleteResults = async (query: string) => {
  const { data } = await axios.get<{ predictions: [] }>(
    `${API_AUTO_COMPLETE_URL}?input=${query}&types=%28regions%29&key=${API_KEY}`
  );

  return data.predictions;
};

router
  .route("/auto-complete")
  .get(async (req: Request<{}, {}, {}, SearchQueryParams>, res) => {
    try {
      const input = req.query.input;
      const result = await getAutoCompleteResults(input);
      console.log(result);
      res.json(result);
    } catch (error) {
      console.error("Error reading the places file", error);
      res.status(500).json({ message: "Server error reading places data" });
    }
  });

const getResultByQuery = async (query: string) => {
  const { data } = await axios.get<{ data: {} }>(
    `${API_URL}?query=popular+tourist+attractions+in+${query}&key=${API_KEY}`
  );

  return data;
};

router
  .route("/search")
  .get(async (req: Request<{}, {}, {}, SearchQueryParams>, res) => {
    try {
      const { q, limit, token } = req.query;
      const result = await getResultByQuery(q);
      console.log(result);
      res.json(result);
    } catch (error) {
      console.error("Error reading the places file", error);
      res.status(500).json({ message: "Server error reading places data" });
    }
  });

const addNewPlace = async (req: any, res: any) => {
  const { place_id, place_name, photo_reference, trip_id } = req.body;
  if (!place_id || !place_name || !photo_reference || !trip_id) {
    return res.json(400).json({ error: "All fields are required" });
  }

  try {
    await knexapp.transaction(async (trx) => {
      await knexapp("places")
        .insert({
          place_id,
          place_name,
          photo_reference,
        })
        .onConflict(["place_id", "place_name", "photo_reference"])
        .ignore()
        .transacting(trx);

      await knexapp("trips_places")
        .insert({
          trip_id,
          place_id,
        })
        .transacting(trx);
    });
    res.status(200).send("success");
  } catch (err: any) {
    res.status(500).json({ error: `Error adding place data ${err.message}` });
  }
};
router.post("/addPlace", addNewPlace);
export default router;
