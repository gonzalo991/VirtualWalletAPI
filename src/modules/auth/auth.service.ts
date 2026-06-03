import { AlreadyExistsException, InvalidFieldsException, UnauthorizedException } from "../../exceptions/Exception";
import { prisma } from "../../lib/prisma";
import { comparePassword, hashPassword } from "../../utils/hash";
import { signRefreshToken, signToken, verifyRefreshToken } from "../../utils/jwt";
import type { LoginDto } from "./dto/Login.dto";
import type { RegisterDto } from "./dto/Register.dto";
import type { AuthResponse } from "./response/AuthResponse.dto";
import { AuthMapper } from "./response/AuthMapper";
import { logger } from "../../lib/logger";
import type { RefreshTokenResponse } from "./response/RefreshTokenResponse";
import { randomUUID } from "crypto";

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

        const accessToken = signToken({
            id: prismaUser.id,
            email: prismaUser.email
        });

        const refreshToken = signRefreshToken({
            id: prismaUser.id,
            email: prismaUser.email,
            jti: randomUUID(),
        });

        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: prismaUser.id,
                expiresAt: new Date(
                    Date.now() + 7 * 24 * 60 * 60 * 1000
                )
            }
        });

        return AuthMapper.toDomain(prismaUser, accessToken, refreshToken);
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

        const accessToken = signToken({
            id: prismaUser.id,
            email: prismaUser.email
        });

        const refreshToken = signRefreshToken({
            id: prismaUser.id,
            email: prismaUser.email,
            jti: randomUUID(),
        });

        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: prismaUser.id,

                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            }
        });

        return AuthMapper.toDomain(prismaUser, accessToken, refreshToken);

    } catch (error) {
        logger.error(`[Login Service Error]`);
        throw error;
    }
}

export const refreshSession = async (refreshToken: string): Promise<RefreshTokenResponse> => {
    try {
        const storedToken = await prisma.refreshToken.findUnique({
            where: { token: refreshToken }
        });

        if (!storedToken) {
            logger.error("[Refresh Session] Unauthorized user");
            throw UnauthorizedException("Invalid refresh token");
        }

        if (storedToken.expiresAt < new Date()) {

            await prisma.refreshToken.delete({
                where: {
                    token: refreshToken
                }
            });

            logger.info(`[Refresh Session] Refresh token expired`)
            throw UnauthorizedException(
                "Refresh token expired"
            );
        }

        const payload = verifyRefreshToken(refreshToken);

        const accessToken = signToken({
            id: payload.id,
            email: payload.email,
        });

        const newRefreshToken = signRefreshToken({
            id: payload.id,
            email: payload.email,
            jti: randomUUID(),
        });

        await prisma.$transaction([
            prisma.refreshToken.delete({
                where: { token: refreshToken }
            }),
            prisma.refreshToken.create({
                data: {
                    token: newRefreshToken,
                    userId: payload.id, expiresAt: new Date(
                        Date.now() + 7 * 24 * 60 * 60 * 1000
                    )
                }
            })
        ]);


        return AuthMapper.toRefreshTokenResponse(accessToken, newRefreshToken);
    } catch (error) {
        logger.error(`[Refresh Token] Session Error`);
        throw error;
    }
}

export const logout = async (refreshToken: string) => {
    await prisma.refreshToken.deleteMany({
        where: { token: refreshToken }
    });

    return null;
}

export const logoutAllSessions = async (userId: string) => {
    await prisma.refreshToken.deleteMany({
        where: {
            userId
        }
    });

    return null;
};