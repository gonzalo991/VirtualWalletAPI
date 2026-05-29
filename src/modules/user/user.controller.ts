import type { CreateUserDto } from "./dto/CreateUser.dto.js";
import { createUser, getUserByEmail, getUserById, updateUser } from "./user.service.js";
import type { UpdateUserDto } from "./dto/UpdateUser.dto.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/apiResponse.js";

export const createUserController = asyncHandler(async (req, res) => {
    const createUserDto: CreateUserDto = req.body;
    const newUser = await createUser(createUserDto);
    return res.status(201).json(
        ApiResponse.success("User created", newUser)
    );
});

export const updateUserController = asyncHandler(async (req, res) => {
    const userId = req.params.id?.toString() || "";
    const updateUserDto: UpdateUserDto = req.body;
    const updatedUser = await updateUser(userId, updateUserDto);
    return res.status(200).json(
        ApiResponse.success("User updated", updatedUser)
    );
});

export const getUserByEmailController = asyncHandler(async (req, res) => {
    const email = req.params.email?.toString().trim() || "";
    const user = await getUserByEmail(email);
    return res.status(200).json(
        ApiResponse.success("User data served", user)
    );
});

export const getUserByIdController = asyncHandler(async (req, res) => {
    const id = req.params.id?.toString() || "";
    const user = await getUserById(id);
    return res.status(200).json(
        ApiResponse.success("User data by id served", user)
    );
});