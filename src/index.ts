import express, { Router } from "express";
import "dotenv/config";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import { getAuth } from "@clerk/express";
import dotenv from "dotenv";
import places from "./routes/places";
import trips from "./routes/trips";
import openAI from "./routes/openAi";
import { rateLimit } from "express-rate-limit";
import weather from "./routes/weather";

dotenv.config({
  path: "../.env",
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: any, res: any): string => {
    const { userId } = getAuth(req);
    if (!userId) {
      return "";
    }
    return userId;
  },
});

const app = express();

const PORT = process.env.PORT;
app.use(
  clerkMiddleware({
    authorizedParties: ["http://localhost:5173"],
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
    secretKey: process.env.CLERK_SECRET_KEY,
  })
);
app.use(limiter);

app.use(cors());
app.use(express.json());

app.get(
  "/",

  (req, res) => {
    res.send("This is home page");
  }
);
app.use(
  "/places",

  places
);
app.use(
  "/trips",

  trips
);
app.use(
  "/ai",

  openAI
);
app.use("/place", weather);
app.listen(PORT, () => {
  console.log("Server is listening on port " + PORT);
});
