import request from "supertest";
import app from "../server";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { pool } from "../database/connection";

describe("User Routes", () => {
  let validToken: string;
  let invalidToken: string;
  let testUserId: number;
  let testUserToken: string;

  // Limpa o banco antes desta suite de testes
  beforeAll(async () => {
    await pool.query("TRUNCATE TABLE users RESTART IDENTITY CASCADE");

    const uniqueEmail = `testuser${Date.now()}@email.com`;
    const response = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: uniqueEmail,
      password: "senha123",
    });

    testUserId = response.body.user.id;
    testUserToken = response.body.token;
  });

  beforeEach(() => {
    validToken = jwt.sign(
      { userId: 999999 },
      config.jwt.secret || "test-secret",
      {
        expiresIn: "1h",
      }
    );

    invalidToken = "token.invalido.aqui";
  });

  describe("GET /api/users/profile", () => {
    it("deve retornar o perfil do usuário autenticado com sucesso", async () => {
      const response = await request(app)
        .get("/api/users/profile")
        .set("Authorization", `Bearer ${testUserToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id", testUserId);
      expect(response.body).toHaveProperty("name", "Test User");
      expect(response.body).toHaveProperty("email");
      expect(response.body).not.toHaveProperty("password_hash");
    });

    it("deve retornar erro 401 quando não há token", async () => {
      const response = await request(app).get("/api/users/profile");

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error");
    });

    it("deve retornar erro 401 quando o token é inválido", async () => {
      const response = await request(app)
        .get("/api/users/profile")
        .set("Authorization", `Bearer ${invalidToken}`);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error");
    });

    it("deve retornar erro 401 quando o header Authorization está mal formatado", async () => {
      const response = await request(app)
        .get("/api/users/profile")
        .set("Authorization", validToken);

      expect(response.status).toBe(401);
    });

    it("deve retornar erro 404 quando o usuário não existe (token válido mas user inexistente)", async () => {
      const response = await request(app)
        .get("/api/users/profile")
        .set("Authorization", `Bearer ${validToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error", "User not found");
    });
  });

  describe("GET /api/users/", () => {
    it("deve retornar lista de todos os usuários com sucesso", async () => {
      const response = await request(app)
        .get("/api/users")
        .set("Authorization", `Bearer ${testUserToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      const firstUser = response.body[0];
      expect(firstUser).toHaveProperty("id");
      expect(firstUser).toHaveProperty("name");
      expect(firstUser).toHaveProperty("email");
      expect(firstUser).not.toHaveProperty("password_hash");
    });

    it("deve retornar erro 401 quando não há token", async () => {
      const response = await request(app).get("/api/users");

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error");
    });

    it("deve retornar erro 401 quando o token é inválido", async () => {
      const response = await request(app)
        .get("/api/users")
        .set("Authorization", `Bearer ${invalidToken}`);

      expect(response.status).toBe(401);
    });
  });
});
