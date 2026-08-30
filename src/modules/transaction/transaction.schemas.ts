import { z } from "zod";
import { Currency } from "@prisma/client";

export const depositSchema = z.object({
    currency: z.nativeEnum(Currency),
    amount: z.number().positive("Amount must be greater than zero"),
    description: z.string().optional(),
});

export const withdrawSchema = z.object({
    currency: z.nativeEnum(Currency),
    amount: z.number().positive("Amount must be greater than zero"),
    description: z.string().optional(),
});

export const transferSchema = z.object({
    currency: z.nativeEnum(Currency),
    amount: z.number().positive("Amount must be greater than zero"),
    destinationAccountId: z.string().uuid("Invalid destination account ID"),
    description: z.string().optional(),
});