import bcrypt from "bcrypt";

export const encryptPassword = (password) => {
  return bcrypt.hash(password, 10);
};

export const comparePassword = (hashedPassword, password) => {
  return bcrypt.compare(password, hashedPassword);
};
