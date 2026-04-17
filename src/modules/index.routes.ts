import { Router } from "express";
import userRouter from "./user/user.routes.js";

const router: Router = Router();

router.use("/user", userRouter);

export default router;