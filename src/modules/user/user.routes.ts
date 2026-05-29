import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validation.middleware.js";
import {
    createUserController, updateUserController,
    getUserByEmailController, getUserByIdController
} from "./user.controller.js";
import { Router } from "express";
import { createUserSchema, updateUserSchema } from "./user.schemas.js";

const userRouter: Router = Router();

userRouter.post("/create", validate(createUserSchema), createUserController);
userRouter.patch("/update/:id", validate(updateUserSchema), authMiddleware, updateUserController);
userRouter.get("/email/:email", authMiddleware, getUserByEmailController);
userRouter.get("/id/:id", authMiddleware, getUserByIdController);

export default userRouter;