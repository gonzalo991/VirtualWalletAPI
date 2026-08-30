import type { Currency } from "@prisma/client";

export interface TransferDto {
    currency: Currency;
    amount: number;
    destinationAccountId: string;
    description?: string;
    idempotencyKey?: string;
}