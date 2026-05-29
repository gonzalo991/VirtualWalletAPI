import { AlreadyExistsException, InvalidFieldsException, UnauthorizedException } from "../../exceptions/Exception";
import { prisma } from "../../lib/prisma";
import { comparePassword, hashPassword } from "../../utils/hash";
import { signToken } from "../../utils/jwt";
import type { LoginDto } from "./dto/Login.dto";
import type { RegisterDto } from "./dto/Register.dto";
import type { AuthResponse } from "./response/AuthResponse.dto";
import { AuthMapper } from "./response/AuthMapper";
import { logger } from "../../lib/logger";

export const register = async (dto: RegisterDto): Promise<AuthResponse> => {
    try {
        const existingUser = await prisma.user.findUnique({
            where: { email: dto.email }
        });

        if (existingUser) {
            logger.info(`[Register] User is already registered with this email: ${dto.email}`);
            throw AlreadyExistsException("Email already in use");
        }

        const hashedPassword = await hashPassword(dto.password);

        const prismaUser = await prisma.user.create({
            data: {
                username: dto.username.trim(),
                email: dto.email.trim().toLowerCase(),
                password: hashedPassword,
            }
        });

        const token = signToken({
            id: prismaUser.id,
            email: prismaUser.email,
        });

        return AuthMapper.toDomain(prismaUser, token);
    } catch (error) {
        logger.error(`[Register Service Error]`);
        if ((error as any).code === "P2002") {
            throw AlreadyExistsException("Email already exists");
        }

        throw error;
    }
}
export const login = async (dto: LoginDto): Promise<AuthResponse> => {
    if (!dto.email || !dto.password) {
        logger.info("[Login] Dto Validation failed. Missing fields");
        throw InvalidFieldsException("Missing credentials");
    }

    const normalizedEmail = dto.email.trim().toLowerCase();

    try {

        const prismaUser = await prisma.user.findUnique({
            where: { email: normalizedEmail }
        });

        if (!prismaUser) {
            logger.info(`[Login] User not found with email: ${normalizedEmail}`);
            throw UnauthorizedException("Invalid credentials");
        }

        const isPasswordValid = await comparePassword(
            dto.password,
            prismaUser.password
        );

        if (!isPasswordValid) {
            logger.info("[Login] Password doesnt match");
            throw UnauthorizedException("Invalid credentials");
        }

        const token = signToken({
            id: prismaUser.id,
            email: prismaUser.email
        });

        return AuthMapper.toDomain(prismaUser, token);

    } catch (error) {
        logger.error(`[Login Service Error]`);
        throw error;
    }
}