import { z } from "zod";

export const registerSchema = z.object({
    username: z.string()
        .min(3, "User must contain at least 3 characters")
        .max(20),

    email: z.string().email("Invalid email"),

    password: z.string()
        .min(6, "Password must contain at least 6 characters")
});

export const loginSchema = z.object({
    email: z.string().email("Invalid email"),

    password: z.string().min(6)
});

export const refreshSchema = z.object({
    refreshToken: z.string().min(1)
});

export const logoutSchema = z.object({
    refreshToken: z.string().min(1)
});

export const googleLoginSchema = z.object({
    idToken: z.string().min(1, "Google token is required")
});

export const forgotPasswordSchema = z.object({
    email: z.string().email("Invalid email"),
})