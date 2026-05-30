import rateLimit from "express-rate-limit";

export const authRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        message: "Too many login attempts",
    }
});

export const apiRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
});