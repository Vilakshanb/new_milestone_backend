import jwt from "jsonwebtoken";
import { CONFIG } from "./config";

export const generateAccessJwt = async (obj) => {
  console.log(obj);
  return jwt.sign(
    {
      ...obj,
      exp: Math.floor(Date.now() / 1000) + 604800, //valid for 7 days
    },
    CONFIG.JWT_ACCESS_TOKEN_SECRET
  );
};

export const generateRefreshJwt = async (obj) => {
  return jwt.sign(
    {
      ...obj,
      exp: Math.floor(Date.now() / 1000) + 604800, //7 days
    },
    CONFIG.JWT_ACCESS_TOKEN_SECRET
  );
};
