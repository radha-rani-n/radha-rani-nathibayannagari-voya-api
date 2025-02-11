import express from "express";
import "dotenv/config";
import cors from "cors";
import "dotenv/config";
const app = express();

const { PORT } = process.env;
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("This is home page");
});
app.listen(PORT, () => {
  console.log("Server is listening on port " + PORT);
});
