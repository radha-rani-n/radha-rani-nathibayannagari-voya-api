import express from "express";
const router = express.Router();
import axios from "axios";
import knex from "knex";
import config from "../client/knexfile";
import { getAuth } from "@clerk/express";
import exp from "constants";
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

const getAutoCompleteApiResults = async (query: string) => {
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
  return data.suggestions;
};

const getAutoCompleteResults = async (req: any, res: any) => {
  try {
    const input = req.query.input;
    const result = await getAutoCompleteApiResults(input);
    res.json(result);
  } catch (error) {
    console.error("Error reading the places file", error);
    res.status(500).json({ message: "Server error reading places data" });
  }
};

const getApiResultByQuery = async (query: string) => {
  const { data } = await axios.post<{ data: {} }>(
    API_URL,
    {
      textQuery: `Tourist attractions in ${query}`,
    },
    {
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": API_KEY,
        "X-Goog-FieldMask":
          "places.id,places.displayName,places.formattedAddress,places.photos,places.types,places.primaryType,places.location",
      },
    }
  );

  return data;
};

const getResultByQuery = async (req: any, res: any) => {
  try {
    const { q, limit, token } = req.query;
    const result = await getApiResultByQuery(q);
    res.json(result);
  } catch (error) {
    console.error("Error reading the places file", error);
    res.status(500).json({ message: "Server error reading places data" });
  }
};
const updateTrips = async (req: any, res: any) => {
  const { userId } = getAuth(req);
  const {
    place_id,
    place_name,
    photo_reference,
    unsplash_image_url,
    latitude,
    longitude,
    trip_ids,
  } = req.body;
  if (
    !place_id ||
    !place_name ||
    !photo_reference ||
    !unsplash_image_url ||
    !trip_ids ||
    !latitude ||
    !longitude
  ) {
    return res.json(400).json({ error: "All fields are required" });
  }

  try {
    await knexapp.transaction(async (trx) => {
      await knexapp("places")
        .insert({
          place_id,
          place_name,
          photo_reference,
          unsplash_image_url,
          latitude,
          longitude,
        })
        .onConflict(["place_id"])
        .ignore()
        .transacting(trx);

      await knexapp("trips_places")
        .insert(
          trip_ids.map((ele: string[]) => {
            return { trip_id: ele, place_id, user_id: userId };
          })
        )
        .onConflict(["trip_id", "place_id"])
        .ignore()
        .transacting(trx);
    });
    res.status(200).send("success");
  } catch (err: any) {
    res.status(500).json({ error: `Error adding place data ${err.message}` });
  }
};

const deletePlace = async (req: any, res: any) => {
  try {
    const { tripId } = req.params;
    const { placeId } = req.query;
    const tripPlace = await knexapp("trips_places")
      .where({ trip_id: tripId, place_id: placeId })
      .first();
    if (!tripPlace) {
      return res.status(404).json({ error: `Trip ID ${tripId} not found` });
    }
    await knexapp("trips_places")
      .where({ trip_id: tripId, place_id: placeId })
      .del();
    res.status(204).send();
  } catch (err: any) {
    res.status(500).json({
      error: `Error deleting place from trip ${req.params.tripId}: ${err.message}`,
    });
  }
};

const getFoodPlacesByQuery = async (query: string) => {
  const { data } = await axios.post<{ data: {} }>(
    API_URL,
    {
      textQuery: `Popular Food Places in ${query}`,
    },
    {
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": API_KEY,
        "X-Goog-FieldMask":
          "places.id,places.displayName,places.formattedAddress,places.photos,places.types,places.primaryType,places.location,places.rating,places.reviews,places.googleMapsLinks",
      },
    }
  );

  return data;
};

const getFoodPlaces = async (req: any, res: any) => {
  try {
    const { q, limit, token } = req.query;
    const result = await getFoodPlacesByQuery(q);
    res.json(result);
  } catch (error) {
    console.error("Error reading the places file", error);
    res.status(500).json({ message: "Server error reading places data" });
  }
};

export {
  getAutoCompleteResults,
  getResultByQuery,
  updateTrips,
  deletePlace,
  getFoodPlaces,
};
