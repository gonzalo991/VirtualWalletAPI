import jwt, { type JwtPayload } from "jsonwebtoken";
import { env } from "../config/env";
import { randomUUID } from "crypto";

const JWT_SECRET = String(env.JWT_SECRET);
const JWT_EXPIRES_IN = String(env.JWT_EXPIRES_IN);
const JWT_REFRESH_SECRET = String(env.JWT_REFRESH_SECRET);
const JWT_REFRESH_EXPIRES_IN = String(env.JWT_REFRESH_EXPIRES_IN);

export const signToken = (payload: object) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as any });
};

export const verifyToken = (token: string) => {
    return jwt.verify(token, JWT_SECRET);
};

export const signRefreshToken = (payload: JwtPayload) => {
    return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN as any })
};

export const verifyRefreshToken = (token: string) => {
    return jwt.verify(token, JWT_REFRESH_SECRET) as JwtPayload;
}

export async function createTokens(prismaUser: any, prisma: any) {
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

    return { accessToken, refreshToken };
}