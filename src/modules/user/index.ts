import {
    createUserController, updateUserController,
    getUserByEmailController
} from "./user.controller.js";
import { Router } from "express";

const userRouter: Router = Router();

userRouter.post("/create", createUserController);
userRouter.patch("/update/:email", updateUserController);
userRouter.get("/email", getUserByEmailController);

export default userRouter;