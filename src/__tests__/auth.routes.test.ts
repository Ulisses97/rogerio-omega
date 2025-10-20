import request from "supertest";
import app from "../server";
import { pool } from "../database/connection";

describe("Auth Routes", () => {
  let createdUserEmail: string;
  let createdUserToken: string;

  beforeAll(async () => {
    await pool.query("TRUNCATE TABLE users RESTART IDENTITY CASCADE");
  });

  describe("POST /api/auth/register", () => {
    it("deve registrar um novo usuário com sucesso", async () => {
      const uniqueEmail = `test${Date.now()}@email.com`;

      const response = await request(app).post("/api/auth/register").send({
        name: "João Silva",
        email: uniqueEmail,
        password: "senha123",
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("user");
      expect(response.body).toHaveProperty("token");
      expect(response.body.user).toHaveProperty("id");
      expect(response.body.user).toHaveProperty("name", "João Silva");
      expect(response.body.user).toHaveProperty("email", uniqueEmail);
      expect(response.body.user).not.toHaveProperty("password_hash");
      expect(typeof response.body.token).toBe("string");

      createdUserEmail = uniqueEmail;
      createdUserToken = response.body.token;
    });

    it("deve retornar erro 400 quando tenta registrar email já existente", async () => {
      const email = `duplicate${Date.now()}@email.com`;
      await request(app).post("/api/auth/register").send({
        name: "User 1",
        email: email,
        password: "senha123",
      });

      const response = await request(app).post("/api/auth/register").send({
        name: "User 2",
        email: email,
        password: "outrasenha",
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toContain("já foi registrado");
    });

    it("deve retornar erro 400 quando o nome está vazio", async () => {
      const response = await request(app).post("/api/auth/register").send({
        name: "",
        email: "joao@email.com",
        password: "senha123",
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("errors");
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: "name",
            message: expect.any(String),
          }),
        ])
      );
    });

    it("deve retornar erro 400 quando o nome tem menos de 2 caracteres", async () => {
      const response = await request(app).post("/api/auth/register").send({
        name: "A",
        email: "joao@email.com",
        password: "senha123",
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("errors");
    });

    it("deve retornar erro 400 quando o email é inválido", async () => {
      const response = await request(app).post("/api/auth/register").send({
        name: "João Silva",
        email: "email-invalido",
        password: "senha123",
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("errors");
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: "email",
            message: expect.stringContaining("inválido"),
          }),
        ])
      );
    });

    it("deve retornar erro 400 quando a senha tem menos de 6 caracteres", async () => {
      const response = await request(app).post("/api/auth/register").send({
        name: "João Silva",
        email: "joao@email.com",
        password: "12345",
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("errors");
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: "password",
            message: expect.stringContaining("6"),
          }),
        ])
      );
    });

    it("deve retornar erro 400 quando faltam campos obrigatórios", async () => {
      const response = await request(app).post("/api/auth/register").send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("errors");
      expect(response.body.errors.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe("POST /api/auth/login", () => {
    it("deve fazer login com sucesso usando usuário registrado", async () => {
      const email = `logintest${Date.now()}@email.com`;
      const password = "senha123";

      await request(app).post("/api/auth/register").send({
        name: "Test User",
        email: email,
        password: password,
      });

      const response = await request(app).post("/api/auth/login").send({
        email: email,
        password: password,
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("user");
      expect(response.body).toHaveProperty("token");
      expect(response.body.user).toHaveProperty("email", email);
      expect(response.body.user).not.toHaveProperty("password_hash");
      expect(typeof response.body.token).toBe("string");
    });

    it("deve retornar erro 401 quando a senha está incorreta", async () => {
      const email = `wrongpass${Date.now()}@email.com`;

      await request(app).post("/api/auth/register").send({
        name: "Test User",
        email: email,
        password: "senhaCorreta123",
      });

      const response = await request(app).post("/api/auth/login").send({
        email: email,
        password: "senhaErrada",
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toContain("Credenciais inválidas");
    });

    it("deve retornar erro 400 quando falta o email", async () => {
      const response = await request(app).post("/api/auth/login").send({
        password: "senha123",
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("errors");
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: "email",
          }),
        ])
      );
    });

    it("deve retornar erro 400 quando falta a senha", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "joao@email.com",
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("errors");
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: "password",
          }),
        ])
      );
    });

    it("deve retornar erro 400 quando o email é inválido", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "email-invalido",
        password: "senha123",
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("errors");
    });

    it("deve retornar erro 401 quando o usuário não existe", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "naoexiste@email.com",
        password: "senha123",
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toContain("Credenciais inválidas");
    });
  });
});
