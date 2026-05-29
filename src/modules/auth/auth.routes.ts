import { Router } from "express";
import { loginController, registerController } from "./auth.controller";
import { validate } from "../../middlewares/validation.middleware";
import { loginSchema, registerSchema } from "./auth.schemas";

const authRouter = Router();

authRouter.post("/register", validate(registerSchema), registerController);

authRouter.post("/login", validate(loginSchema), loginController);

export default authRouter;