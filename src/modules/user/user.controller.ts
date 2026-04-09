import type { CreateUserDto } from "./dto/CreateUser.dto.js";
import type { Request, Response } from "express";
import { createUser, getUserByEmail, updateUser } from "./user.service.js";
import { ControllerException } from "../../exceptions/Exception.js";

export const CreateUserController = async (req: Request, res: Response) => {
    try {
        const createUserDto: CreateUserDto = req.body;
        const newUser = await createUser(createUserDto);
        return res.status(201).json(newUser);
    } catch (error) {
        const statusCode: number = (error as any).statusCode || 500;
        throw ControllerException(`An Error occurred while creating user:${(error as any).message}\n`, statusCode);
    }
}

export const updateUserController = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id?.toString() || "";
        const updateUserDto: CreateUserDto = req.body;
        const updatedUser = await updateUser(userId, updateUserDto);
        return res.status(200).json(updatedUser);
    } catch (error) {
        const statusCode: number = (error as any).statusCode || 500;
        throw ControllerException(`An Error occurred while updating user:${(error as any).message}\n`, statusCode);
    }
}

export const getUserByEmailController = async (req: Request, res: Response) => {
    try {
        const email = req.query.email?.toString() || "";
        const user = await getUserByEmail(email);
        return res.status(200).json(user);
    } catch (error) {
        const statusCode: number = (error as any).statusCode || 500;
        throw ControllerException(`An Error occurred while fetching user:${(error as any).message}\n`, statusCode);
    }
}