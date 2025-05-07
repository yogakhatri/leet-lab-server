import { Router } from "express";

import {
  registerUser,
  verifyUser,
  login,
  updateProfile,
  refreshToken,
  passwordResetToken,
} from "../controllers/user.controller.js";
import {
  loginUserValidator,
  registerUserValidator,
} from "../validators/userRoute.validators.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  accessTokenValidation,
  refreshTokenValidation,
} from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", registerUserValidator, validate, registerUser);

router.get("/verify/:token", verifyUser);

router.post("/login", loginUserValidator, validate, login);

router.put("/update-profile", accessTokenValidation, updateProfile);

router.get("/refresh-token", refreshTokenValidation, refreshToken);

router.get("/password-reset-token", passwordResetToken);

export default router;
