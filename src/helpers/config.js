import "dotenv/config";

export const CONFIG = {
  MONGOURI: process.env.MONGOURI,
  PORT: process.env.PORT,
  JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET,
  SERVER_URL: process.env.SERVER_URL,
  RAZOR_PAY_API_KEY: process.env.RAZOR_PAY_API_KEY,
  RAZOR_PAY_API_SECRET: process.env.RAZOR_PAY_API_SECRET,
};
