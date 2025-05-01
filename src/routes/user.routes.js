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
import {
  loginUserValidator,
  registerUserValidator,
} from "../validators/userRoute.validators.js";
import { validate } from "../middlewares/validate.middleware.js";
import { jwtTokenValidation } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", registerUserValidator, validate, registerUser);

router.get("/verify/:token", verifyUser);

router.post("/login", loginUserValidator, validate, login);

router.put("/update-profile", jwtTokenValidation, updateProfile);

router.get("/refresh-token", refreshToken);

router.get("/password-reset-token", passwordResetToken);

router.get("/access-token", accessToken);

export default router;
