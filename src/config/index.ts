import dotenv from "dotenv";

dotenv.config();

const isTestEnvironment = process.env.NODE_ENV === "test";

export const config = {
  port: process.env.PORT,
  nodeEnv: process.env.NODE_ENV,

  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
    // Use banco de dados separado para testes
    database: isTestEnvironment
      ? process.env.DB_TEST_NAME || `${process.env.DB_NAME}_test`
      : process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
};
