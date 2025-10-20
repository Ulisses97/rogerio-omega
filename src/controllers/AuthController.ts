import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        res.status(400);
        throw new Error(
          "Nome, email e senha é obrigatorio. Por favor, tente novamente!"
        );
      }

      const result = await authService.register({ name, email, password });

      return res.status(201).json(result);
    } catch (error: any) {
      res.status(400);
      throw error;
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400);
        throw new Error("Email and password are required");
      }

      const result = await authService.login({ email, password });

      return res.status(200).json(result);
    } catch (error: any) {
      res.status(401);
      throw error;
    }
  }
}
