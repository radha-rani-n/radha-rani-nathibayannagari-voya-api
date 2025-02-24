import express from "express";
const router = express.Router();

import { getWeather } from "../controllers/weatherController";

router.get("/weather", getWeather);

export default router;
