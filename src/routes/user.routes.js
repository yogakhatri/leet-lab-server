import { Router } from "express";

import {
  registerUser,
  verifyUser,
  login,
  updateProfile,
  refreshToken,
  passwordResetToken,
  accessToken,
} from "../controllers/user.controller.js";
import { registerUserValidator } from "../validators/userRoute.validators.js";

const router = Router();

router.post("/register", registerUserValidator, registerUser);

router.get("/verify", verifyUser);

router.get("/login", login);

router.put("/update-profile", updateProfile);

router.get("/refresh-token", refreshToken);

router.get("/password-reset-token", passwordResetToken);

router.get("/access-token", accessToken);

export default router;
