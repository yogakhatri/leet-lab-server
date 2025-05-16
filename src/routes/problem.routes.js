import { Router } from "express";
import {
  accessTokenValidation,
  checkAdmin,
} from "../middlewares/auth.middleware.js";
import {
  createProblem,
  deleteProblem,
  deleteProblemById,
  getAllProblems,
  getAllProblemsSolvedByUser,
  getProblemById,
} from "../controllers/problem.controller.js";

const problemRoutes = Router();

problemRoutes.post(
  "/create-problem",
  accessTokenValidation,
  checkAdmin,
  createProblem,
);

problemRoutes.get("/get-all-problems", accessTokenValidation, getAllProblems);

problemRoutes.get("/get-problem/:id", accessTokenValidation, getProblemById);

problemRoutes.put(
  "/update-problem/:id",
  accessTokenValidation,
  checkAdmin,
  deleteProblem,
);

problemRoutes.delete(
  "/delete-problem/:id",
  accessTokenValidation,
  checkAdmin,
  deleteProblemById,
);

problemRoutes.get(
  "/get-solved-problems",
  accessTokenValidation,
  getAllProblemsSolvedByUser,
);

export default problemRoutes;
