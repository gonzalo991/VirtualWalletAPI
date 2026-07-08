import bcrypt from "bcrypt";
import { logger } from "../lib/logger";
import { UnauthorizedException } from "../exceptions/Exception";
import type { LoginDto } from "../modules/auth/dto/Login.dto";


const SALT_ROUNDS = 10;

export const hashPassword = (password: string) => {
    return bcrypt.hash(password, SALT_ROUNDS);
}

export const comparePassword = (password: string, hash: string): Promise<boolean> => {
    return bcrypt.compare(password, hash);
}

export async function validatePassword(prismaUser: any, dto: LoginDto, normalizedEmail: string) {
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
}