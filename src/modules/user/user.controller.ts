import type { CreateUserDto } from "./dto/CreateUser.dto.js";
import type { NextFunction, Request, Response } from "express";
import { createUser, getUserByEmail, updateUser } from "./user.service.js";

export const createUserController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const createUserDto: CreateUserDto = req.body;
        const newUser = await createUser(createUserDto);
        return res.status(201).json(newUser);
    } catch (error) {
        next(error);
        return;
    }
}

export const updateUserController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.id?.toString() || "";
        const updateUserDto: CreateUserDto = req.body;
        const updatedUser = await updateUser(userId, updateUserDto);
        return res.status(200).json(updatedUser);
    } catch (error) {
        next(error);
        return;
    }
}

export const getUserByEmailController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const email = req.query.email?.toString() || "";
        const user = await getUserByEmail(email);
        return res.status(200).json(user);
    } catch (error) {
        next(error);
        return;
    }
}    