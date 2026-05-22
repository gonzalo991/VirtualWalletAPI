import { AlreadyExistsException, InvalidFieldsException, ServiceException, UnauthorizedException } from "../../exceptions/Exception";
import { prisma } from "../../lib/prisma";
import { comparePassword, hashPassword } from "../../utils/hash";
import { signToken } from "../../utils/jwt";
import { validateDtoFields, validateEmail } from "../../validators/user.validators";
import type { LoginDto } from "./dto/Login.dto";
import type { RegisterDto } from "./dto/Register.dto";
import type { AuthResponse } from "./response/AuthResponse.dto";
import { AuthMapper } from "./response/AuthMapper";

export const register = async (dto: RegisterDto): Promise<AuthResponse> => {

    validateDtoFields(dto);
    validateEmail(dto.email);

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email: dto.email }
        });

        if (existingUser) {
            console.log(`[Register] User is already registered with this email: ${dto.email}`);
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
        if ((error as any).statusCode) throw error;

        if ((error as any).code === "P2002") {
            throw AlreadyExistsException("Email already exists");
        }

        throw ServiceException("Unexpected error during register");
    }
}

export const login = async (dto: LoginDto): Promise<AuthResponse> => {
    if (!dto.email || !dto.password) {
        console.log("[Login] Dto Validation failed. Missing fields");
        throw InvalidFieldsException("Missing credentials");
    }

    validateEmail(dto.email);

    try {
        const prismaUser = await prisma.user.findUnique({
            where: { email: dto.email }
        });

        if (!prismaUser) {
            console.log(`[Login] User not found with email: ${dto.email}`);
            throw UnauthorizedException("Invalid credentials");
        }

        const isPasswordValid = await comparePassword(dto.password, prismaUser.password);

        if (!isPasswordValid) {
            console.log(`[Login] Password doesnt match`);
            throw UnauthorizedException("Invalid credentials.");
        }

        const token = signToken({
            id: prismaUser.id,
            email: prismaUser.email
        });

        return AuthMapper.toDomain(prismaUser, token);
    } catch (error) {
        if ((error as any).statusCode) throw error;

        throw ServiceException("Unexpected error during login");
    }
}