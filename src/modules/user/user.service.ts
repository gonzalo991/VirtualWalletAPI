import type { CreateUserDto } from "./dto/CreateUser.dto.js";
import type { UserResponse } from "./response/UserResponse.js";
import { prisma } from "../../lib/prisma.js";
import { UserMapper } from "./response/UserMapper.js";
import type { UpdateUserDto } from "./dto/UpdateUser.dto.js";
import { AlreadyExistsException, InvalidFieldsException, NotFoundException, ServiceException } from "../../exceptions/Exception.js";
import { validateDtoFields, validateEmail } from "../../validators/user.validators.js";

export const createUser = async (dto: CreateUserDto): Promise<UserResponse> => {
    if (!dto) throw InvalidFieldsException("User data is required to create an user!");

    validateDtoFields(dto);
    validateEmail(dto.email);

    try {
        const existingUser = await prisma.user.findUnique({ where: { email: dto.email } });
        if (existingUser) throw AlreadyExistsException("User with this email already exists", 409);

        console.debug("Creating user with data: ", dto);

        const prismaUser = await prisma.user.create({
            data: dto
        });
        const user = UserMapper.toDomain(prismaUser);
        return UserMapper.toResponse(user);
    } catch (error) {
        const statusCode = (error as any).statusCode || 500;
        throw ServiceException("Error creating user at service: ", statusCode);
    }
}

export const updateUser = async (id: string, dto: UpdateUserDto): Promise<UserResponse> => {
    if (!dto) throw InvalidFieldsException("No fields to update", 422);

    try {
        const prismaUser = await prisma.user.update({
            where: { id },
            data: dto
        });
        const user = UserMapper.toDomain(prismaUser);
        return UserMapper.toResponse(user);
    } catch (error) {
        const statusCode = (error as any).statusCode || 500;
        throw ServiceException("Error updating user at service: ", statusCode);
    }
}

export const getUserByEmail = async (email: string): Promise<UserResponse> => {
    if (!email) throw InvalidFieldsException("Email is required to fetch user by email", 400);
    validateEmail(email);

    try {
        const prismaUser = await prisma.user.findUnique({
            where: { email }
        });
        if (!prismaUser) throw NotFoundException("User not found", 404);
        const user = UserMapper.toDomain(prismaUser);
        return UserMapper.toResponse(user);
    } catch (error) {
        const statusCode = (error as any).statusCode || 500;
        throw ServiceException("Error fetching user by email", statusCode);
    }
}