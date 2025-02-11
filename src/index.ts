import express, { Router } from "express";
import "dotenv/config";
import cors from "cors";
import "dotenv/config";
import places from "./routes/places";

const app = express();

const PORT = process.env.PORT;
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("This is home page");
});
app.use("/places", places);
app.listen(PORT, () => {
  console.log("Server is listening on port " + PORT);
});
