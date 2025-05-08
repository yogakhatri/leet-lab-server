import jwt from "jsonwebtoken";

import { httpStatus } from "../utils/constants.js";
import { ApiResponses } from "../utils/api-responses.js";

// TODO: add functionality to check refresh token as well whenever checking access token
export const accessTokenValidation = (req, res, next) => {
  try {
    if (!req.headers?.authorization) {
      throw new Error();
    }

    if (!req.cookies) {
      throw new Error();
    }
    const token = req.headers.authorization.substring(7);
    jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET,
      function (err, decodedToken) {
        if (err) {
          throw new Error();
        }
      },
    );

    return next();
  } catch (error) {
    return res
      .status(httpStatus.BadRequest)
      .json(new ApiResponses(httpStatus.BadRequest, "Invalid Request", error));
  }
};

export const refreshTokenValidation = (req, res, next) => {
  try {
    if (!req.cookies) {
      throw new Error();
    }
    const { refreshToken } = req.cookies;
    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET,
      function (err, decodedToken) {
        if (err) {
          throw new Error();
        }
      },
    );
    return next();
  } catch (error) {
    return res
      .status(httpStatus.BadRequest)
      .json(
        new ApiResponses(httpStatus.BadRequest, "Please login again", error),
      );
  }
};
