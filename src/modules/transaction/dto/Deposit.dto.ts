import type { Currency } from "@prisma/client";

export interface DepositDto {
    currency: Currency;
    amount: number;
    description?: string;
    idempotencyKey?: string;
}