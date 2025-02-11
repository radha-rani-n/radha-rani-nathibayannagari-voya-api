import express from "express";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
const router = express.Router();

type tripProps = {
  place: string;
  startDate: string;
  endDate: string;
  status: string;
  noOfTravellers: number;
};

const addTrip = ({
  place,
  startDate,
  endDate,
  status,
  noOfTravellers,
}: tripProps) => {};
