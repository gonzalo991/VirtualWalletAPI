import { AlreadyExistsException, InvalidFieldsException, UnauthorizedException } from "../../exceptions/Exception";
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
import { createDefaultAccounts } from "../account/account.service";

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

        await createDefaultAccounts(prismaUser.id);

        const { accessToken, refreshToken } = await createTokens(prismaUser, prisma);

        return AuthMapper.toDomain(prismaUser, accessToken, refreshToken);
    } catch (error) {
        logger.error(`[Register Service Error]`);
        if ((error as any).code === "P2002") {
            const target = (error as any).meta?.target;
            if (target?.includes("username")) {
                throw AlreadyExistsException("Username already exists");
            }
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
        logger.info(`[Google Auth Service] Email not found in token payload`);
        throw UnauthorizedException("Invalid Token");
    }

    const normalizedEmail = payload.email.trim().toLowerCase();

    let user = await prisma.user.findUnique({
        where: { email: normalizedEmail }
    });

    if (user && !user.googleId) {
        user = await prisma.user.update({
            where: { id: user.id },
            data: { googleId: payload.sub }
        });
    }

    if (!user) {
        const randomPassword = await hashPassword(randomUUID());

        const baseUsername = (payload.name || normalizedEmail.split("@")[0]!)
            .toLowerCase()
            .replace(/\s+/g, "_")
            .replace(/[^a-z0-9_]/g, "");

        const uniqueUsername = `${baseUsername}_${randomUUID().slice(0, 4)}`;

        user = await prisma.user.create({
            data: {
                email: normalizedEmail,
                username: uniqueUsername,
                googleId: payload.sub,
                password: randomPassword,
            }
        });
    }

    const { accessToken, refreshToken } = await createTokens(user, prisma);

    return AuthMapper.toDomain(user, accessToken, refreshToken);
};

export const forgotPassword = async (email: string) => {
    try {
        const normalizedEmail = email.trim().toLowerCase();
        const user = await prisma.user.findUnique({
            where: { email: normalizedEmail }
        });

        if (user) {
            const token = randomUUID();
            await prisma.passwordResetToken.create({
                data: {
                    token,
                    userId: user.id,
                    expiresAt: new Date(Date.now() + 15 * 60 * 1000)
                }
            });
            // await mailerService.sendResetEmail(user.email, token);
        }

        return {
            message: "If an account with that email exists, a password reset link has been sent."
        };
    } catch (error) {
        logger.error(`[Forgot Password Service] An unexpected error occurred.`);
        throw error;
    }
}