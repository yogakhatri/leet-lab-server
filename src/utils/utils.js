import bcrypt from "bcryptjs";

export const getHashedPassword = async (password) => {
  return bcrypt.hash(password, 10);
};
