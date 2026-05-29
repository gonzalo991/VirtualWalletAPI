import { z } from "zod";

export const createUserSchema = z.object({
    username: z
        .string()
        .min(3, "Username must contain at least 3 characters")
        .max(20),

    email: z
        .email("Invalid email"),

    password: z
        .string()
        .min(6, "Password must contain at least 6 characters")
});

export const updateUserSchema = z.object({
    username: z
        .string()
        .min(3)
        .max(20)
        .optional(),

    email: z
        .email("Invalid email")
        .optional()
})
.refine(
    (data) => Object.keys(data).length > 0,
    {
        message: "At least one field is required"
    }
);