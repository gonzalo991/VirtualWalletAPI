import { AlreadyExistsException, InvalidFieldsException, NotFoundException, UnauthorizedException } from "../../exceptions/Exception";
import { prisma } from "../../lib/prisma";
import { hashPassword, validatePassword } from "../../utils/hash";
import { signRefreshToken, signToken, verifyRefreshToken, createTokens } from "../../utils/jwt";
import type { LoginDto } from "./dto/Login.dto";
import type { RegisterDto } from "./dto/Register.dto";
import type { AuthResponse } from "./response/AuthResponse.dto";
import { AuthMapper } from "./response/AuthMapper";
import { logger } from "../../lib/logger";
import type { RefreshTokenResponse } from "./response/RefreshTokenResponse";
import { randomUUID } from "crypto";
import { googleClient } from "../../lib/google-client";
import { env } from "../../config/env";

export const register = async (dto: RegisterDto): Promise<AuthResponse> => {
    try {
        const normalizedUsername = dto.username.trim();
        const normalizedEmail = dto.email.trim().toLowerCase();
        const hashedPassword = await hashPassword(dto.password);

        const prismaUser = await prisma.user.create({
            data: {
                username: normalizedUsername,
                email: normalizedEmail,
                password: hashedPassword,
            }
        });

        const { accessToken, refreshToken } = await createTokens(prismaUser, prisma);

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

        await validatePassword(prismaUser, dto, normalizedEmail);

        const { accessToken, refreshToken } = await createTokens(prismaUser, prisma);

        return AuthMapper.toDomain(prismaUser!, accessToken, refreshToken);
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

export const googleLoginService = async (idToken: string) => {
    const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: env.OAUTH_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload?.email) {
        logger.info(`[Google Auth Service] Email not found`);
        throw UnauthorizedException("Invalid Token");
    }

    let user = await prisma.user.findUnique({
        where: {
            email: payload.email,
        }
    });

    if (user && !user.googleId) {

        user = await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                googleId: payload.sub
            }
        })

    }

    if (!user) {
        const randomPassword = await hashPassword(randomUUID());

        user = await prisma.user.create({
            data: {
                email: payload.email,
                username: payload.name ?? payload.email.split("@")[0]!,
                googleId: payload.sub,
                password: randomPassword,
            }
        });
    }

    const { accessToken, refreshToken } = await createTokens(user, prisma);

    return AuthMapper.toDomain(
        user,
        accessToken,
        refreshToken
    );
}

export const forgotPassword = async (email: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: { email }
        })


        if (!user) {
            throw NotFoundException("USER_NOT_FOUND")
        }


        const token = randomUUID();


        await prisma.passwordResetToken.create({
            data: {
                token,
                userId: user.id,
                expiresAt: new Date(
                    Date.now() + 15 * 60 * 1000
                )
            }
        })

        // Add mailer service
        return {
            message: "Reset email sent"
        }
    } catch (error) {
        logger.error(`[Forgot Password Service] An unexpected error occurred.`);
        throw error;
    }
}