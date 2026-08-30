import { Router } from "express";
import userRouter from "./user/user.routes.js";
import authRouter from "./auth/auth.routes.js";
import accountRouter from "./account/account.routes.js";

const router: Router = Router();

router.use("/user", userRouter);
router.use("/auth", authRouter);
router.use("/account", accountRouter);

export default router;