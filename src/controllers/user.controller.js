import "dotenv/config";

import { PrismaClient } from "../../generated/prisma/index.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponses } from "../utils/api-responses.js";
import { asyncHandler } from "../utils/async-handler.js";
import { httpStatus } from "../utils/constants.js";
import { sendEmail } from "../utils/send-mails.js";
import { getHashedPassword } from "../utils/utils.js";

const prisma = new PrismaClient();
// TODO: write test cases for different scenarios
export const registerUser = asyncHandler(async (req, res) => {
  const { username, password, email, name } = req.body;
  const hashPassword = await getHashedPassword(password);
  const verificationToken = crypto.randomUUID();
  const verificationTokenExpiry = Date.parse(new Date()) + 1000 * 60 * 15;

  const user = await prisma.user.create({
    data: {
      email,
      username,
      password: hashPassword,
      name,
      isVerified: false,
      verificationToken,
      verificationTokenExpiry,
    },
  });

  if (!user) {
    return new ApiError(httpStatus.BadRequest, "Please try after sometime");
  }

  await sendEmail(
    "yogakhatri@gmail.com",
    user.email,
    "Click on link to verify your email address",
    `http://127.0.0.1:${process.env.PORT}/api/v1/user/verify/${verificationToken}`,
  ).catch((err) => {
    // TODO: detect the issue and send appropriate status code and message.
    return res
      .status(httpStatus.ServiceUnavailable)
      .json(
        new ApiResponses(httpStatus.ServiceUnavailable, "Registration Failed!"),
      );
  });

  return res
    .status(httpStatus.Created)
    .json(
      new ApiResponses(
        httpStatus.Created,
        "Registration successful! Please check your email to verify your account.",
      ),
    );
});

export const verifyUser = async (req, res) => {
  const { token } = req.params;

  const user = await prisma.user.findFirst({
    where: { verificationToken: token },
  });

  if (!user) {
    return res
      .status(httpStatus.BadRequest)
      .json(new ApiResponses(httpStatus.BadRequest, "User not found"));
  }

  if (user.accessTokenExpiry >= Date.parse(new Date())) {
    return res
      .status(httpStatus.BadRequest)
      .json(
        new ApiResponses(
          httpStatus.BadRequest,
          "The token has expired. Please click 'Verify User' to send the verification email again.",
        ),
      );
  }

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      isVerified: true,
    },
  });

  return res
    .status(httpStatus.OK)
    .json(new ApiResponses(httpStatus.OK, "User verified successfully."));
};

export const login = (req, res) => {};

export const updateProfile = (req, res) => {};

export const refreshToken = (req, res) => {};

export const passwordResetToken = (req, res) => {};

export const accessToken = (req, res) => {};
