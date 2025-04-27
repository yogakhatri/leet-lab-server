import bcrypt from "bcryptjs";

export const getHashedPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};
