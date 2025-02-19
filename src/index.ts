import express, { Router } from "express";
import "dotenv/config";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import { requireAuth, getAuth } from "@clerk/express";
import dotenv from "dotenv";
import places from "./routes/places";
import trips from "./routes/trips";

dotenv.config({
  path: "../.env",
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
app.listen(PORT, () => {
  console.log("Server is listening on port " + PORT);
});
