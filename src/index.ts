import express, { Router } from "express";
import "dotenv/config";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import { requireAuth, getAuth } from "@clerk/express";
import dotenv from "dotenv";
import places from "./routes/places";
import trips from "./routes/trips";
import openAI from "./routes/open-ai";
import { rateLimit } from "express-rate-limit";
import weather from "./routes/weather";

dotenv.config({
  path: "../.env",
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
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
  // requireAuth(),
  (req, res) => {
    res.send("This is home page");
  }
);
app.use(
  "/places",
  // requireAuth(),
  places
);
app.use(
  "/trips",
  // requireAuth({
  //   authorizedParties: ["http://localhost:5173"],
  //   publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  //   secretKey: process.env.CLERK_SECRET_KEY,
  // }),
  trips
);
app.use(
  "/ai",
  // requireAuth({
  //   authorizedParties: ["http://localhost:5173"],
  //   publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  //   secretKey: process.env.CLERK_SECRET_KEY,
  // }),
  openAI
);
app.use("/place", weather);
app.listen(PORT, () => {
  console.log("Server is listening on port " + PORT);
});
