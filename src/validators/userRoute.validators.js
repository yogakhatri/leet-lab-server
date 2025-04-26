import { body, validationResult } from "express-validator";

export const registerUserValidator = (req, res, next) => {
  console.log("validating register");
  body("username")
    .trim()
    .isString()
    .notEmpty()
    .escape()
    .isLength({ min: 4, max: 15 })
    .withMessage(
      "Username must be 4–15 characters long and can include only letters and numbers.",
    );

  body("password")
    .trim()
    .isString()
    .notEmpty()
    .escape()
    .isLength({ min: 8, max: 15 })
    .withMessage(
      "Password must be 8–15 characters long and must include small and capital letters, numbers, and special symbols.",
    );

  body("email")
    .trim()
    .isEmail()
    .notEmpty()
    .escape()
    .withMessage("Please enter a valid email address.");

  body("name")
    .trim()
    .isString()
    .isLength({ min: 2, max: 30 })
    .notEmpty()
    .escape()
    .withMessage(
      "Name must be2-30 characters long and should include only alphabets",
    );

  const result = validationResult(req);
  if (result.isEmpty()) {
    next();
  } else res.send({ errors: result.array() });
};
