import pool from "./config/";

async function testPostgres() {
  const result = await pool.query("SELECT NOW()");
  console.log("PostgreSQL conectado:", result.rows[0]);
}

testPostgres();
