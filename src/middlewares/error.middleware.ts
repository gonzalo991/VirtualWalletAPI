import type { Request, Response, NextFunction } from "express";

export const errorMiddleware = (
    error: any,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {

    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
        success: false,
        message: error.message || "Internal server error"
    });
};