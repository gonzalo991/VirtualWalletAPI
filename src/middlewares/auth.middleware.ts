import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UnauthorizedException } from "../exceptions/Exception";
import { env } from "../config/env";

const JWT_SECRET = env.JWT_SECRET;

export interface AuthRequest extends Request {
    userId?: string;
}

interface JwtPayload {
    id: string;
    email: string;
}

export const authMiddleware = (
    req: AuthRequest,
    _res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            console.log("[Auth Middleware] Token missed.");
            throw UnauthorizedException("Token not provided.");
        }

        const [, token] = authHeader.split(" ");

        if (!token) {
            console.log("[Auth Middleware] Invalid token format.");
            throw UnauthorizedException("Invalid token");
        }

        const decoded = jwt.verify(
            token,
            JWT_SECRET
        ) as JwtPayload;

        req.userId = decoded.id;

        return next();

    } catch (error) {
        console.log("[Auth Middleware] Middleware authorization error.");
        return next(
            UnauthorizedException("Unauthorized.")
        );
    }
};