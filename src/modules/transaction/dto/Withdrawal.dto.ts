import type { Currency } from "@prisma/client";

export interface WithdrawalDto {
    currency: Currency;
    amount: number;
    description?: string;
    idempotencyKey?: string;
}