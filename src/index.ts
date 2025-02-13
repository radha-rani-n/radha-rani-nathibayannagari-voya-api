import express, { Router } from "express";
import "dotenv/config";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import { clerkClient, requireAuth, getAuth } from "@clerk/express";
import "dotenv/config";
import places from "./routes/places";
import trips from "./routes/trips";

const app = express();

const PORT = process.env.PORT;
app.use(
  clerkMiddleware({
    authorizedParties: ["http://localhost:5173"],
  })
);
// app.get("/protected", requireAuth(), async (req, res) => {
//   const { userId } = getAuth(req);

//   const user = await clerkClient.users.getUser(userId);

//   return res.json({ user });
// });

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
  // requireAuth(),
  trips
);
app.listen(PORT, () => {
  console.log("Server is listening on port " + PORT);
});
