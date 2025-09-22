import { connectDB } from "./config/db";
import express, { Application } from "express";
import cors from "cors";

connectDB();

const app: Application = express();

app.use(cors());
app.use(express.json());
