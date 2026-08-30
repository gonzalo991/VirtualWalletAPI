import type { Currency, TransactionStatus, TransactionType } from "@prisma/client";
import type { LedgerEntryEntity } from "./Ledger-entry.entity";

export class TransactionEntity {
    constructor(
        public readonly id: string,
        public readonly idempotencyKey: string | null,
        public readonly type: TransactionType,
        public readonly status: TransactionStatus,
        public readonly amount: string,
        public readonly fee: string,
        public readonly currency: Currency,
        public readonly description: string | null,
        public readonly sourceAccountId: string | null,
        public readonly destinationAccountId: string | null,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
        public readonly ledgerEntries: LedgerEntryEntity[] = [],
    ) { }

    public isCompleted(): boolean {
        return this.status === "COMPLETED";
    }
}