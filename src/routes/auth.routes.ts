import { Router, Request, Response } from "express";
import { AuthController } from "../controllers/AuthController";
import {
  registerValidator,
  loginValidator,
} from "../validators/auth.validator";
import { validate } from "../middlewares/validate";

const router = Router();
const authController = new AuthController();

router.post(
  "/register",
  registerValidator,
  validate,
  (req: Request, res: Response) => authController.register(req, res)
);

router.post("/login", loginValidator, validate, (req: Request, res: Response) =>
  authController.login(req, res)
);

export default router;
