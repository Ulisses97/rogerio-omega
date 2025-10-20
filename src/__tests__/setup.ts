import { pool } from "../database/connection";

process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-secret-key";
process.env.JWT_EXPIRES_IN = "1h";

global.console = {
  ...console,
  log: jest.fn(),
  info: jest.fn(),
};

// Hook que executa antes de todos os testes
beforeAll(async () => {
  // Aguarda a conexão com o banco estar pronta
  await pool.query("SELECT 1");
  // Limpa o banco uma vez no início de todos os testes
  await pool.query("TRUNCATE TABLE users RESTART IDENTITY CASCADE");
});

// Hook que executa depois de todos os testes
afterAll(async () => {
  // Limpa o banco e fecha a conexão
  await pool.query("TRUNCATE TABLE users RESTART IDENTITY CASCADE");
  await pool.end();
});
