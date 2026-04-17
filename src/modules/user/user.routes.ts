import {
    createUserController, updateUserController,
    getUserByEmailController, getUserByIdController
} from "./user.controller.js";
import { Router } from "express";

const userRouter: Router = Router();

userRouter.post("/create", createUserController);
userRouter.patch("/update/:id", updateUserController);
userRouter.get("/email/:email", getUserByEmailController);
userRouter.get("/id/:id", getUserByIdController);

export default userRouter;