import { Router } from "express";
import userRouter from "./user/user.routes.js";
import authRouter from "./auth/auth.routes.js";

const router: Router = Router();

router.use("/user",  userRouter);
router.use("/auth", authRouter);

export default router;