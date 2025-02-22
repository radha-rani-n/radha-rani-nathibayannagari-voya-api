import express from "express";
import axios from "axios";
const router = express.Router();
import knex from "knex";
import config from "src/client/knexfile";

const API_URL = "http://api.weatherapi.com/v1";
const API_KEY = process.env.WEATHER_API_KEY;

interface weatherResponse {
  current: {
    temp_c: number;
  };
}
const getWeatherData = async (query: string) => {
  const { data } = await axios.get<weatherResponse>(
    `${API_URL}/current.json?q=${query}&key=${API_KEY}`
  );

  return data.current.temp_c;
};

const getWeather = async (req: any, res: any) => {
  try {
    const { q } = req.query;
    const result = await getWeatherData(q);
    res.json(result);
  } catch (error) {
    console.error("Error reading the places file", error);
    res.status(500).json({ message: "Error getting weather data" });
  }
};

router.get("/weather", getWeather);
export default router;
