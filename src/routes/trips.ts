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
const getTrips = async (req: any, res: any) => {
  try {
    const trips = await knexapp("trips");
    res.status(200).json(trips);
  } catch (err) {
    console.error(err);
    res.status(404).send("Error getting trips data:", err);
  }
};
router.get("/", getTrips);
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
const deleteTrip = async (req: any, res: any) => {
  try {
    const { tripId } = req.params;
    const trip = await knexapp("trips").where({ tripId }).first();
    if (!trip) {
      return res.status(404).json({ error: `Trip ID ${tripId} not found` });
    }
    await knexapp("trips").where({ id: tripId }).del();
    res.status(204).send();
  } catch (err: any) {
    res
      .status(500)
      .json({ error: `Error deleting trip ${req.params.id}: ${err.message}` });
  }
};
router.delete("/trips/:tripId", deleteTrip);
export default router;
