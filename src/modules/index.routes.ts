import { Router } from "express";
import userRouter from "./user/user.routes.js";
import authRouter from "./auth/auth.routes.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router: Router = Router();

router.use("/user", authMiddleware, userRouter);
router.use("/auth", authRouter);

export default router;