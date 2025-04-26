import express from "express";
import dotenv from "dotenv";

import userRoutes from "./routes/user.routes.js";

dotenv.config({
  path: "./.env",
});

export const port = process.env.PORT || 3000;

export const app = express();

app.use(express.json());

app.use("/user", userRoutes);
