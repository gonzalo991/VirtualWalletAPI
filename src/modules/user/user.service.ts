import type { CreateUserDto } from "./dto/CreateUser.dto.js";
import type { UserResponse } from "./response/UserResponse.js";
import { prisma } from "../../lib/prisma.js";
import { UserMapper } from "./response/UserMapper.js";
import type { UpdateUserDto } from "./dto/UpdateUser.dto.js";

// Manejar Excepciones personalizadas para UserService

export const createUser = async (dto: CreateUserDto): Promise<UserResponse> => {
    if (Object.keys(dto).length === 0) throw new Error("No fields to create");

    try {
        const prismaUser = await prisma.user.create({
            data: dto
        });
        const user = UserMapper.toDomain(prismaUser);
        return UserMapper.toResponse(user);
    } catch (error) {
        throw new Error("Error creating user");
    }
}

export const updateUser = async (id: string, dto: UpdateUserDto): Promise<UserResponse> => {
    if (Object.keys(dto).length === 0) throw new Error("No fields to update");

    try {
        const prismaUser = await prisma.user.update({
            where: { id },
            data: dto
        });
        const user = UserMapper.toDomain(prismaUser);
        return UserMapper.toResponse(user);
    } catch (error) {
        throw new Error("Error updating user");
    }
}

export const getUserByEmail = async (email: string): Promise<UserResponse> => {
    // Crear validaciones para el email en nueva carpeta validators/emailValidator.ts
    if (email.trim() === "" || !email.includes("@") || email.trim().length === 0)
        throw new Error("Email is required");

    try {
        const prismaUser = await prisma.user.findUnique({
            where: { email }
        });
        if (!prismaUser) throw new Error("User not found");
        const user = UserMapper.toDomain(prismaUser);
        return UserMapper.toResponse(user);
    } catch (error) {
        throw new Error("Error fetching user by email");
    }
}