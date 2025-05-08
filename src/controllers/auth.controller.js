import "dotenv/config";
import jwt from "jsonwebtoken";

import { ApiError } from "../utils/api-error.js";
import { ApiResponses } from "../utils/api-responses.js";
import { asyncHandler } from "../utils/async-handler.js";
import { httpStatus } from "../utils/constants.js";
import { sendEmail } from "../utils/send-mails.js";
import { getHashedPassword } from "../utils/utils.js";
import { db } from "../lib/db.js";


// TODO: write test cases for different scenarios
export const registerUser = asyncHandler(async (req, res) => {
  const { username, password, email, name } = req.body;
  const hashPassword = await getHashedPassword(password);
  const verificationToken = crypto.randomUUID();
  const verificationTokenExpiry = Date.parse(new Date()) + 1000 * 60 * 15;

  const user = await db.user.create({
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

  const user = await db.user.findFirst({
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

  await db.user.update({
    where: {
      id: user.id,
    },
    data: {
      isVerified: true,
      verificationTokenExpiry: undefined,
    },
  });

  return res
    .status(httpStatus.OK)
    .json(new ApiResponses(httpStatus.OK, "User verified successfully."));
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = getHashedPassword(password);

  const user = await db.user.findFirst({
    where: {
      username,
      password: hashedPassword,
    },
  });

  if (!user || !user.isVerified) {
    return res
      .status(httpStatus.BadRequest)
      .json(
        new ApiResponses(
          httpStatus.BadRequest,
          !!user
            ? "username or password is incorrect"
            : "Please verify user first.",
        ),
      );
  }

  const accessToken = generateAccessAndRefreshToken(user, res);

  return res.status(httpStatus.OK).json(
    new ApiResponses(httpStatus.OK, "Login Successful.", {
      accessToken,
    }),
  );
};

export const updateProfile = asyncHandler(async (req, res) => {
  const { username, email, name, image, id } = req.body;
  const updatedUser = await db.user.update({
    where: { id },
    data: { username, email, name, image },
  });

  return res.status(httpStatus.OK).json(
    new ApiResponses(httpStatus.OK, "User updated successfully", {
      user: updatedUser,
    }),
  );
});

// TODO: Create a separate table and store information of previous refresh tokens
export const refreshToken = async (req, res) => {
  const { id } = jwt.verify(
    req.cookies.refreshToken,
    process.env.JWT_REFRESH_SECRET,
  );
  const user = await getUserById(id);
  const accessToken = generateAccessAndRefreshToken(user, res);

  return res.status(httpStatus.OK).json(
    new ApiResponses(httpStatus.OK, "Login Successful.", {
      accessToken,
    }),
  );
};

export const passwordResetToken = (req, res) => {};

const generateAccessAndRefreshToken = (user, res) => {
  const refreshToken = jwt.sign(
    {
      id: user.id,
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_VALIDITY },
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: true,
    maxAge: 84000000,
  });

  return jwt.sign(
    {
      username: user.username,
      email: user.email,
      id: user.id,
    },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_VALIDITY },
  );
};

const getUserById = async (id) => {
  const user = await db.user.findFirst({
    where: {
      id,
    },
  });

  if (!user) {
    return res
      .status(httpStatus.BadRequest)
      .json(new ApiResponses(httpStatus.BadRequest, "Invalid Credentials"));
  }
  return user;
};
