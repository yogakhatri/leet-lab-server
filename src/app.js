import express from "express";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

export const port = process.env.PORT || 3000;

export const app = express();
