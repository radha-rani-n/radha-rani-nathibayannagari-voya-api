import express from "express";
const router = express.Router();
import {
  getAutoCompleteResults,
  getResultByQuery,
  updateTrips,
} from "../controllers/placesController";

router.get("/auto-complete", getAutoCompleteResults);

router.get("/search", getResultByQuery);

//   const { userId } = getAuth(req);
//   const {
//     place_id,
//     place_name,
//     photo_reference,
//     latitude,
//     longitude,
//     trip_ids,
//   } = req.body;
//   if (
//     !place_id ||
//     !place_name ||
//     !photo_reference ||
//     !trip_ids ||
//     !latitude ||
//     !longitude
//   ) {
//     return res.json(400).json({ error: "All fields are required" });
//   }

//   try {
//     await knexapp.transaction(async (trx) => {
//       await knexapp("places")
//         .insert({
//           place_id,
//           place_name,
//           photo_reference,
//           latitude,
//           longitude,
//         })
//         .onConflict(["place_id", "place_name", "photo_reference"])
//         .ignore()
//         .transacting(trx);

//       await knexapp("trips_places")
//         .insert(
//           trip_ids.map((ele: string[]) => {
//             return { trip_id: ele, place_id, user_id: userId };
//           })
//         )
//         .onConflict(["trip_id", "place_id"])
//         .ignore()
//         .transacting(trx);
//     });
//     res.status(200).send("success");
//   } catch (err: any) {
//     res.status(500).json({ error: `Error adding place data ${err.message}` });
//   }
// };
router.post("/updateTrips", updateTrips);

export default router;
