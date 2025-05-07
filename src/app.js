import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/user.routes.js";

dotenv.config({
  path: "./.env",
});

export const port = process.env.PORT || 3000;

export const app = express();

app.use(cookieParser());

app.use(express.json());

app.use(cors());

app.use("/api/v1/user", userRoutes);
// app.use("/api/v1/problem", problemRoutes);
