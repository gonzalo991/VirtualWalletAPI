import { authMiddleware } from "../../middlewares/auth.middleware.js";
import {
    createUserController, updateUserController,
    getUserByEmailController, getUserByIdController
} from "./user.controller.js";
import { Router } from "express";

const userRouter: Router = Router();

userRouter.post("/create", createUserController);
userRouter.patch("/update/:id", authMiddleware, updateUserController);
userRouter.get("/email/:email", authMiddleware, getUserByEmailController);
userRouter.get("/id/:id", authMiddleware, getUserByIdController);

export default userRouter;