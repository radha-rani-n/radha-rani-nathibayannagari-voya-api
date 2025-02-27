import express, { Router } from "express";

import dotenv from "dotenv";
dotenv.config({
  path: ".env",
});

import config from "./client/knexfile";
import knex from "knex";
const knexapp = knex(config);

import cors from "cors";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import { getAuth } from "@clerk/express";

import places from "./routes/places";
import trips from "./routes/trips";
import openAI from "./routes/openAi";
import { rateLimit } from "express-rate-limit";
import weather from "./routes/weather";

const app = express();
const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
  console.log("Server is listening on port " + PORT);
});

app.use(express.json());

//Only allow these origins to interact with our backend
const allowed_origins = [];
if (process.env.FRONTEND_URL) {
  allowed_origins.push(process.env.FRONTEND_URL);
}
if (process.env.ENVIRONMENT && process.env.ENVIRONMENT === "LOCAL") {
  allowed_origins.push(process.env.LOCAL_FRONTEND_URL ?? "");
}
app.use(cors());

app.use(
  clerkMiddleware({
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
    secretKey: process.env.CLERK_SECRET_KEY,
  })
);

// Throttle callers
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 1000, // 100 calls
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
app.use(limiter);

// Homepage
app.get("/", (req: express.Request, res: express.Response) => {
  res.status(200).send("Hello World!");
});

app.use(
  "/places",
  requireAuth({
    signInUrl: process.env.CLERK_SIGNIN_URL,
    signUpUrl: process.env.CLERK_SIGNUP_URL,
  }),
  places
);
app.use(
  "/trips",
  requireAuth({
    signInUrl: process.env.CLERK_SIGNIN_URL,
    signUpUrl: process.env.CLERK_SIGNUP_URL,
  }),
  trips
);
app.use(
  "/ai",
  requireAuth({
    signInUrl: process.env.CLERK_SIGNIN_URL,
    signUpUrl: process.env.CLERK_SIGNUP_URL,
  }),
  openAI
);
app.use(
  "/place",
  // requireAuth({
  //   signInUrl: process.env.CLERK_SIGNIN_URL,
  //   signUpUrl: process.env.CLERK_SIGNUP_URL,
  // }),
  weather
);

export { knexapp };
