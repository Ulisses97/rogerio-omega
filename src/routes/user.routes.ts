import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { authMiddleware } from "../middlewares/auth";

const router = Router();
const userController = new UserController();

router.get("/profile", authMiddleware, async (req, res) =>
  userController.getProfile(req, res)
);

export default router;
