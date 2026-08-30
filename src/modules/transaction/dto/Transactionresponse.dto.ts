import type { Currency, TransactionStatus, TransactionType } from "@prisma/client";

export interface LedgerEntryResponse {
    id: string;
    accountId: string;
    amount: string;
    balanceAfter: string;
    createdAt: Date;
}

export interface TransactionResponse {
    id: string;
    idempotencyKey: string | null;
    type: TransactionType;
    status: TransactionStatus;
    amount: string;
    fee: string;
    currency: Currency;
    description: string | null;
    sourceAccountId: string | null;
    destinationAccountId: string | null;
    createdAt: Date;
    ledgerEntries?: LedgerEntryResponse[];
}