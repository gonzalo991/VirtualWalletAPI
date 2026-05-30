import { Router } from "express";
import { loginController, registerController } from "./auth.controller";
import { validate } from "../../middlewares/validation.middleware";
import { loginSchema, registerSchema } from "./auth.schemas";
import { authRateLimit } from "../../middlewares/rateLimit.middleware";

const authRouter = Router();

authRouter.post(
    "/register",
    validate(registerSchema),
    registerController
);

authRouter.post(
    "/login",
    authRateLimit,
    validate(loginSchema),
    loginController
);

export default authRouter;