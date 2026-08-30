import type { AccountStatus, Currency } from "@prisma/client";

export interface AccountResponse {
    id: string;
    userId: string;
    currency: Currency;
    balance: string;
    status: AccountStatus;
    createdAt: Date;
}