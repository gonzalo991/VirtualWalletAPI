import { z } from "zod";
import { Currency } from "@prisma/client";

export const getAccountByCurrencySchema = z.object({
    params: z.object({
        currency: z.nativeEnum(Currency, {
            error: () => ({ message: "Invalid currency parameter" }),
        }),
    }),
});