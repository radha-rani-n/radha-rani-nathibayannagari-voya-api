import express from "express";
import { getSummaryAPI } from "../controllers/openAiController";
const router = express.Router();

router.get("/getPlaceSummary", getSummaryAPI);

export default router;
