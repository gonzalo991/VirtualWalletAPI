import type { CreateUserDto } from "./dto/CreateUser.dto.js";
import type { NextFunction, Request, Response } from "express";
import { createUser, getUserByEmail, updateUser } from "./user.service.js";
import { ControllerException } from "../../exceptions/Exception.js";

export const CreateUserController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const createUserDto: CreateUserDto = req.body;
        const newUser = await createUser(createUserDto);
        return res.status(201).json(newUser);
    } catch (error) {
        next(error);
        throw ControllerException(`An Error occurred while creating user:${(error as any).message}\n`, (error as any).statusCode);

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
        throw ControllerException(`An Error occurred while updating user:${(error as any).message}\n`, (error as any).statusCode);

    }
}

export const getUserByEmailController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const email = req.query.email?.toString() || "";
        const user = await getUserByEmail(email);
        return res.status(200).json(user);
    } catch (error) {
        next(error);
        throw ControllerException(`An Error occurred while fetching user:${(error as any).message}\n`, (error as any).statusCode);
    }
}    
