import { Router } from "express";
import { loginController, refreshTokenController,
     registerController, logoutController } from "./auth.controller";
import { validate } from "../../middlewares/validation.middleware";
import { loginSchema, logoutSchema, refreshSchema, registerSchema } from "./auth.schemas";
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
validate(refreshSchema),
)
export default authRouter;