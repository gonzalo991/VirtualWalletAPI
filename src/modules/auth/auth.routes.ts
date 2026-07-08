import { Router } from "express";
import {
    loginController, refreshTokenController,
    registerController, logoutController,
    googleLoginController, forgotPasswordController,
    logoutAllSessionsController,
} from "./auth.controller";
import { validate } from "../../middlewares/validation.middleware";
import {
    googleLoginSchema, loginSchema, logoutSchema,
    refreshSchema, registerSchema, forgotPasswordSchema
} from "./auth.schemas";
import { authRateLimit } from "../../middlewares/rateLimit.middleware";
import { authMiddleware } from "../../middlewares/auth.middleware";

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

authRouter.post(
    "/refresh",
    validate(refreshSchema),
    refreshTokenController
);

authRouter.post(
    "/logout",
    validate(logoutSchema),
    logoutController
);

authRouter.post(
    "/logoutAllSessions",
    authMiddleware,
    validate(refreshSchema),
    logoutAllSessionsController,
);

authRouter.post(
    "/google",
    validate(googleLoginSchema),
    googleLoginController);

authRouter.post(
    "/forgot-password",
    validate(forgotPasswordSchema),
    forgotPasswordController);

export default authRouter;