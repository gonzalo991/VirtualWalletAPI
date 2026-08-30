import type { Transaction as PrismaTransaction, LedgerEntry as PrismaLedgerEntry } from "@prisma/client"
import { TransactionEntity } from "../entity/Transaction.entity"
import { LedgerEntryEntity } from "../entity/Ledger-entry.entity"
import type { TransactionResponse } from "../dto/Transactionresponse.dto"

type PrismaTransactionWithEntries = PrismaTransaction & {
    ledgerEntries?: PrismaLedgerEntry[];
};

export class TransactionMapper {
    static toDomainLedgerEntry(prismaEntry: PrismaLedgerEntry): LedgerEntryEntity {
        return new LedgerEntryEntity(
            prismaEntry.id,
            prismaEntry.transactionId,
            prismaEntry.accountId,
            prismaEntry.amount.toString(),
            prismaEntry.balanceAfter.toString(),
            prismaEntry.createdAt
        );
    }

    static toDomain(prismaTransaction: PrismaTransactionWithEntries): TransactionEntity {
        const ledgerEntries = prismaTransaction.ledgerEntries
            ? prismaTransaction.ledgerEntries.map(this.toDomainLedgerEntry)
            : [];

        return new TransactionEntity(
            prismaTransaction.id,
            prismaTransaction.idempotencyKey,
            prismaTransaction.type,
            prismaTransaction.status,
            prismaTransaction.amount.toString(),
            prismaTransaction.fee.toString(),
            prismaTransaction.currency,
            prismaTransaction.description,
            prismaTransaction.sourceAccountId,
            prismaTransaction.destinationAccountId,
            prismaTransaction.createdAt,
            prismaTransaction.updatedAt,
            ledgerEntries
        );
    }

    static toDomainList(prismaTransactions: PrismaTransactionWithEntries[]): TransactionEntity[] {
        return prismaTransactions.map((tx) => this.toDomain(tx));
    }

    static toResponse(entity: TransactionEntity): TransactionResponse {
        return {
            id: entity.id,
            idempotencyKey: entity.idempotencyKey,
            type: entity.type,
            status: entity.status,
            amount: entity.amount,
            fee: entity.fee,
            currency: entity.currency,
            description: entity.description,
            sourceAccountId: entity.sourceAccountId,
            destinationAccountId: entity.destinationAccountId,
            createdAt: entity.createdAt,
            ledgerEntries: entity.ledgerEntries.map((le) => ({
                id: le.id,
                accountId: le.accountId,
                amount: le.amount,
                balanceAfter: le.balanceAfter,
                createdAt: le.createdAt,
            })),
        };
    }

    static toResponseList(entities: TransactionEntity[]): TransactionResponse[] {
        return entities.map((e) => this.toResponse(e));
    }
}