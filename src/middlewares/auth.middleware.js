import jwt from "jsonwebtoken";
import { ApiError } from "../utils/api-error.js";
import { httpStatus } from "../utils/constants.js";

export const jwtTokenValidation = (req, res, next) => {
  const bearerToken = req.headers.authorization.substring(7);

  jwt.verify(
    bearerToken,
    process.env.JWT_ACCESS_SECRET,
    function (err, decoded) {
      if (err) {
        res
          .status(httpStatus.ServiceUnavailable)
          .json(new ApiError(httpStatus.BadRequest, "Invalid access token"));
        return next();
      }
      req.payload = decoded;
    },
  );
  return next();
};
