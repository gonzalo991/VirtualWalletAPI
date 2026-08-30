export class LedgerEntryEntity {
    constructor(
        public readonly id: string,
        public readonly transactionId: string,
        public readonly accountId: string,
        public readonly amount: string,
        public readonly balanceAfter: string,
        public readonly createdAt: Date,
    ){}
}