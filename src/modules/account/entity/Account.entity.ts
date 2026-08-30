import type { AccountStatus, Currency } from "@prisma/client";

export class AccountEntity {
    constructor(
        public readonly id: string,
        public readonly userId: string,
        public readonly currency: Currency,
        public readonly balance: string,
        public readonly status: AccountStatus,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
    ) { }

    public isActive(): boolean {
        return this.status === "ACTIVE";
    }

    public hasSufficientBalance(amount: number | string): boolean {
        return Number(this.balance) >= Number(amount);
    }
}