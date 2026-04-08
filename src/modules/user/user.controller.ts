import type { CreateUserDto } from "./dto/CreateUser.dto.js";
import type { Request, Response } from "express";
import { createUser } from "./user.service.js";

export const CreateUserController = async (req: Request, res: Response) => {
    const createUserDto: CreateUserDto = req.body;
    const newUser = await createUser(createUserDto);
    return res.status(201).json(newUser);
}