import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UnauthorizedException } from "../exceptions/Exception";
import { env } from "../config/env";

const JWT_SECRET = env.JWT_SECRET;

export interface AuthRequest extends Request {
    userId?: string;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            console.log(`[Auth Middleware] Token missed.`);
            throw UnauthorizedException("Token not provided.");
        }

        const [, token] = authHeader.split(" ");

        if (!token) {
            console.log(`[Auth Middleware] Token is not valid.`);
            throw UnauthorizedException("Invalid token");
        }

        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

        req.userId = decoded.userId;

        return next();
    } catch (error) {
        console.log(`[Auth Middleware] Middleware authorization error.`);
        return next(UnauthorizedException("Unauthorized."));
    }
}