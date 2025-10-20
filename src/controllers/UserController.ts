import { Request, Response } from "express";
import { UserRepository } from "../repositories/UserRepository";
import { AuthRequest } from "../middlewares/auth";

const userRepository = new UserRepository();

export class UserController {
  async getProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const user = await userRepository.findById(userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const { password_hash, ...userWithoutPassword } = user;

      return res.status(200).json(userWithoutPassword);
    } catch (error: any) {
      res.status(500);
      throw error;
    }
  }

  async getUsers(req: AuthRequest, res: Response) {
    try {
      const users = await userRepository.findAll();
      const usersWithoutPasswords = users.map(
        ({ password_hash, ...user }) => user
      );
      return res.status(200).json(usersWithoutPasswords);
    } catch (error: any) {
      res.status(500);
      throw error;
    }
  }
}
