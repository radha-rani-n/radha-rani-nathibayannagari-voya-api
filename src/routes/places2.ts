import fs from "fs";
import type { Request, Response } from "express";
import express from "express";
const router = express.Router();
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
const API_KEY = process.env.API_KEY;
interface SearchQueryParams {
  input: string;
  limit: number;
  token: string;
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

const API_URL = "https://maps.googleapis.com/maps/api/place/autocomplete/json";
const getResultByQuery = async (query: string) => {
  const { data } = await axios.get<{ predictions: [] }>(
    `${API_URL}?input=${query}&types=geocode&key=${API_KEY}`
  );

  return data.predictions;
};

router
  .route("/search")
  .get(async (req: Request<{}, {}, {}, SearchQueryParams>, res) => {
    try {
      const input = req.query.input;
      const result = await getResultByQuery(input);
      console.log(result);
      res.json(result);
    } catch (error) {
      console.error("Error reading the places file", error);
      res.status(500).json({ message: "Server error reading places data" });
    }
  });
export default router;
