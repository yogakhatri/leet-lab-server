import { PrismaClient } from "../../generated/prisma/index.js";
import { ApiResponses } from "../utils/ApiResponses.js";
import { getHashedPassword } from "../utils/utils.js";

const prisma = new PrismaClient();

export const registerUser = async (req, res) => {
  console.log("in user controller");
  const { username, password, email, name } = req.body;

  const hashPassword = await getHashedPassword(password);

  const user = await prisma.user.create({
    data: {
      email,
      username,
      password: hashPassword,
      name,
      isVerified: false,
    },
  });
  console.log("user", user);

  res
    .status(httpStatus.Created)
    .json(
      new ApiResponses(
        httpStatus.Created,
        "Registration successful! Please check your email to verify your account.",
      ),
    );
};

export const verifyUser = (req, res) => {};

export const login = (req, res) => {};

export const updateProfile = (req, res) => {};

export const refreshToken = (req, res) => {};

export const passwordResetToken = (req, res) => {};

export const accessToken = (req, res) => {};
