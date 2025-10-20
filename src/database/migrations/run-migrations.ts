import { pool } from "../connection";
import * as fs from "fs";
import * as path from "path";

async function runMigrations() {
  try {
    const migrationFile = path.join(__dirname, "001_create_users_table.sql");
    const sql = fs.readFileSync(migrationFile, "utf-8");

    await pool.query(sql);

    console.log("Migrations run finished");
    process.exit(0);
  } catch (error) {
    console.error("Error migrations", error);
    process.exit(1);
  }
}

runMigrations();
