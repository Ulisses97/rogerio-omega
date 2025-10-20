import { pool } from "../database/connection";
import * as fs from "fs";
import * as path from "path";

process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-secret-key";
process.env.JWT_EXPIRES_IN = "1h";

global.console = {
  ...console,
  log: jest.fn(),
  info: jest.fn(),
};

beforeAll(async () => {
  await pool.query("SELECT 1");

  try {
    const migrationFile = path.join(
      __dirname,
      "../database/migrations/001_create_users_table.sql"
    );
    const sql = fs.readFileSync(migrationFile, "utf-8");
    await pool.query(sql);
  } catch (error: any) {
    if (
      !error.message?.includes("already exists") &&
      !error.message?.includes("duplicate key")
    ) {
      throw error;
    }
  }

  await pool.query("TRUNCATE TABLE users RESTART IDENTITY CASCADE");
});

afterAll(async () => {
  await pool.query("TRUNCATE TABLE users RESTART IDENTITY CASCADE");
  await pool.end();
});
