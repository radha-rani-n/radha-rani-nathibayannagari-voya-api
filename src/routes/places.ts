import express from "express";
const router = express.Router();
import {
  deletePlace,
  getAutoCompleteResults,
  getResultByQuery,
  updateTrips,
} from "../controllers/placesController";

router.get("/auto-complete", getAutoCompleteResults);

router.get("/search", getResultByQuery);

router.post("/updateTrips", updateTrips);
router.delete("/:tripId", deletePlace);
export default router;
