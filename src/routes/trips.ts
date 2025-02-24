import express from "express";

const router = express.Router();
import {
  getTrip,
  getTrips,
  addTrip,
  deleteTrip,
  updateTrip,
} from "../controllers/tripsController";

router.get("/", getTrips);

router.get("/:tripId", getTrip);

router.post("/addTrip", addTrip);

router.delete("/:tripId", deleteTrip);

router.put("/:tripId", updateTrip);

export default router;
