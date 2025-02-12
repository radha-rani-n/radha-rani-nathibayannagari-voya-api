import { error } from "console";
import express from "express";

import knex from "knex";
import { config } from "../client/knexfile";
import { v4 as uuidv4 } from "uuid";
const router = express.Router();

const knexapp = knex(config);

type tripProps = {
  trip_name: string;
  place_name: string;
  from_date: string;
  to_date: string;
  no_of_travellers: number;
};

const addTrip = async (req: { body: tripProps }, res: any) => {
  const {
    trip_name,
    place_name,
    from_date,
    to_date,
    no_of_travellers,
  }: tripProps = req.body;

  if (
    !trip_name ||
    !place_name ||
    !from_date ||
    !to_date ||
    !no_of_travellers
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const addNewTrip = await knexapp("trips").insert({
      trip_name,
      place_name,
      from_date,
      to_date,
      no_of_travellers,
    });
    const newTripId = addNewTrip[0];
    const newTripData = await knexapp("trips").where({
      id: newTripId,
    });
    res.status(200).json(newTripData);
  } catch (err: any) {
    res.status(500).json({ error: `Error adding new trip ${err.message}` });
  }
};
router.post("/addTrip", addTrip);

export default router;
