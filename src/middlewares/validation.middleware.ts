import type { Response, Request, NextFunction } from "express";
import type { ZodSchema } from "zod";

export const validate = (schema: ZodSchema) => (
    req: Request,
    _res: Response,
    next: NextFunction,
) => {
    const result = schema.safeParse(req.body);

    if(!result.success){
        return next({
            statusCode: 422,
            message: result.error.issues[0]?.message
        });
    }

    req.body = result.data;

    return next();
};