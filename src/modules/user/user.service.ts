import type { CreateUserDto } from "./dto/CreateUser.dto.js";
import { UserResponse } from "./response/UserResponse.js";
import { prisma } from "../../lib/prisma.js";
import { UserMapper } from "./response/UserMapper.js";
import type { UpdateUserDto } from "./dto/UpdateUser.dto.js";
import { AlreadyExistsException, InvalidFieldsException, NotFoundException, ServiceException } from "../../exceptions/Exception.js";
import { hashPassword } from "../../utils/hash.js";
import { logger } from "../../lib/logger.js";

export const createUser = async (dto: CreateUserDto): Promise<UserResponse> => {
    try {
        const existingUser = await prisma.user.findUnique({ where: { email: dto.email } });
        if (existingUser) throw AlreadyExistsException("User with this email already exists");

        logger.debug(`Creating user with data: \n ${dto}`);
        const hashedPassword = await hashPassword(dto.password);

        const prismaUser = await prisma.user.create({
            data: {
                ...dto,
                password: hashedPassword as any,
            }
        });
        const user = UserMapper.toDomain(prismaUser);
        return UserMapper.toResponse(user);
    } catch (error) {
        if ((error as any).statusCode) throw error;
        throw ServiceException("Unexpected error creating user");
    }
}

export const updateUser = async (id: string, dto: UpdateUserDto): Promise<UserResponse> => {
    const allowedFields: Partial<UpdateUserDto> = {};
    if (dto.username) allowedFields.username = dto.username;
    if (dto.email) allowedFields.email = dto.email;
    logger.debug("Dto validations passed");

    try {
        const prismaUser = await prisma.user.update({
            where: { id },
            data: allowedFields
        });

        logger.debug(`User updated with data: \n ${dto}`);

        const user = UserMapper.toDomain(prismaUser);
        return UserMapper.toResponse(user);
    } catch (error) {
        if ((error as any).code === "P2025") {
            throw NotFoundException("User not found");
        }

        if ((error as any).code === "P2002") {
            throw AlreadyExistsException("Email already in use");
        }

        if ((error as any).statusCode) throw error;

        throw ServiceException("Unexpected error updating user");
    }
}

export const getUserByEmail = async (email: string): Promise<UserResponse> => {
    const sanitizedEmail = email?.trim();

    if (!sanitizedEmail) {
        throw InvalidFieldsException("Email is required to fetch user by email");
    }

    try {
        const prismaUser = await prisma.user.findUnique({
            where: { email: sanitizedEmail }
        });

        if (!prismaUser) throw NotFoundException("User not found");

        const user = UserMapper.toDomain(prismaUser);
        return UserMapper.toResponse(user);

    } catch (error) {
        if ((error as any).statusCode) throw error;
        throw ServiceException("Unexpected error fetching user by email");
    }
}

export const getUserById = async (id: string): Promise<UserResponse> => {
    if (!id) throw InvalidFieldsException("Missing field: Id . Cannot get the user.");

    try {
        const prismaUser = await prisma.user.findUnique({ where: { id } });
        if (!prismaUser) throw NotFoundException(`User with id: ${id} not found.`);
        const user = UserMapper.toDomain(prismaUser);
        return UserMapper.toResponse(user);
    } catch (error) {
        if ((error as any).statusCode) throw error;
        throw ServiceException("Unexpected error getting user by id");
    }
}