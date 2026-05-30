import jwt, { type JwtPayload } from "jsonwebtoken";
import { env } from "../config/env";

const JWT_SECRET = env.JWT_SECRET;
const JWT_EXPIRES_IN = env.JWT_EXPIRES_IN;
const JWT_REFRESH_SECRET = env.JWT_REFRESH_SECRET;
const JWT_REFRESH_EXPIRES_IN = env.JWT_REFRESH_EXPIRES_IN;

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