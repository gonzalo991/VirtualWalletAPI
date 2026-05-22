import type { Request, Response, NextFunction } from "express";
import { register, login } from "./auth.service";

export const registerController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const response = await register(req.body);
        return res.status(201).json(response);
    } catch (error) {
        return next(error);
    }
}

export const loginController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const response = await login(req.body);
        return res.status(200).json(response);
    } catch (error) {
        return next(error);
    }
}