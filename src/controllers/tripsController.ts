import express from "express";
import { getAuth } from "@clerk/express";
import knex from "knex";
import config from "../client/knexfile";

const router = express.Router();

const knexapp = knex(config);

type tripProps = {
  trip_name: string;
  place_name: string;
  from_date: string;
  to_date: string;
  no_of_travellers: number;
  params: object;
};
const getTrips = async (req: any, res: any) => {
  const { userId } = getAuth(req);
  try {
    const trips = await knexapp("trips").where({
      user_id: userId,
    });
    res.status(200).json(trips);
  } catch (err) {
    console.error(err);
    res.status(404).send("Error getting trips data:", err);
  }
};
const getTrip = async (req: any, res: any) => {
  const { userId } = getAuth(req);
  try {
    const trip = await knexapp("trips")
      .where({ trip_id: req.params.tripId, user_id: userId })
      .first();
    const trip_places = await knexapp("trips_places").where({
      trip_id: req.params.tripId,
      user_id: userId,
    });
    const places = [];
    for (let trip_place of trip_places) {
      const place = await knexapp("places")
        .where({ place_id: trip_place.place_id })
        .first();
      places.push(place);
    }
    res.status(200).json({
      trip,
      places,
    });
  } catch (err) {
    console.error(err);
    res.status(404).send("Error getting trip data:", err);
  }
};

const addTrip = async (req: any, res: any) => {
  const { userId } = getAuth(req);
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
      user_id: userId,
    });
    const newTripId = addNewTrip[0];
    const newTripData = await knexapp("trips").where({
      trip_id: newTripId,
      user_id: userId,
    });
    res.status(200).json(newTripData);
  } catch (err: any) {
    res.status(500).json({ error: `Error adding new trip ${err.message}` });
  }
};

const deleteTrip = async (req: any, res: any) => {
  const { userId } = getAuth(req);
  try {
    const { tripId } = req.params;

    const trip = await knexapp("trips")
      .where({ trip_id: tripId, user_id: userId })
      .first();

    if (!trip) {
      return res.status(404).json({ error: `Trip ID ${tripId} not found` });
    }
    await knexapp("trips").where({ trip_id: tripId, user_id: userId }).del();
    res.status(204).send();
  } catch (err: any) {
    res.status(500).json({
      error: `Error deleting trip ${req.params.tripId}: ${err.message}`,
    });
  }
};

const updateTrip = async (req: any, res: any) => {
  const { userId } = getAuth(req);
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
    const currentTrip = await knexapp("trips").where({
      trip_id: req.params.tripId,
      user_id: userId,
    });
    if (!currentTrip) {
      return res
        .status(404)
        .json({ error: `Trip Id ${req.params.trip_id} not found` });
    }
    await knexapp("trips")
      .where({ trip_id: req.params.tripId, user_id: userId })
      .update({ trip_name, place_name, from_date, to_date, no_of_travellers });
    const updatedTrips = await knexapp("trips").where({
      trip_id: req.params.tripId,
      user_id: userId,
    });
    res.status(200).json(updatedTrips[0]);
  } catch (err: any) {
    res
      .status(500)
      .json({ error: `Error updating trip details: ${err.message}` });
  }
};
export { getTrips, getTrip, addTrip, deleteTrip, updateTrip };
