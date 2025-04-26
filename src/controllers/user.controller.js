import { PrismaClient } from "../../generated/prisma/index.js";

const prisma = new PrismaClient();

export const registerUser = async (req, res) => {
  const { username, password, email, name } = req.body;

  const user = await prisma.user.create({
    data: {
      email,
      username,
      password,
      name,
      isVerified: false,
    },
  });
  console.log("user", user);

  res.send(201);
};

export const verifyUser = (req, res) => {};

export const login = (req, res) => {};

export const updateProfile = (req, res) => {};

export const refreshToken = (req, res) => {};

export const passwordResetToken = (req, res) => {};

export const accessToken = (req, res) => {};
