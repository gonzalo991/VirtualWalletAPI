import { Prisma, TransactionStatus, TransactionType } from "@prisma/client";
import { prisma } from "../../../lib/prisma";
import type { DepositDto } from "../dto/Deposit.dto";
import type { TransferDto } from "../dto/Transfer.dto";
import type { WithdrawalDto } from "../dto/Withdrawal.dto";
import type { TransactionEntity } from "../entity/Transaction.entity";
import { TransactionMapper } from "../response/transaction.mapper";
import type { ITransactionRepository } from "./transaction-repository.interface";
import { InvalidFieldsException } from "../../../exceptions/Exception";

export class PrismaTransactionRepository implements ITransactionRepository {
    async findByIdempotencyKey(key: string): Promise<TransactionEntity | null> {
        const tx = await prisma.transaction.findUnique({
            where: { idempotencyKey: key },
            include: { ledgerEntries: true },
        });

        return tx ? TransactionMapper.toDomain(tx) : null;
    }

    async findById(id: string): Promise<TransactionEntity | null> {
        const tx = await prisma.transaction.findUnique({
            where: { id },
            include: { ledgerEntries: true },
        });

        return tx ? TransactionMapper.toDomain(tx) : null;
    }

    async findByAccountId(accountId: string): Promise<TransactionEntity[]> {
        const transactions = await prisma.transaction.findMany({
            where: {
                OR: [
                    { sourceAccountId: accountId },
                    { destinationAccountId: accountId },
                ],
            },
            include: { ledgerEntries: true },
            orderBy: { createdAt: "desc" }
        });

        return TransactionMapper.toDomainList(transactions);
    }

    async executeDeposit(accountId: string, dto: DepositDto): Promise<TransactionEntity> {
        return prisma.$transaction(async (tx) => {
            // Update balance at destiny account
            const updatedAccount = await tx.account.update({
                where: { id: accountId },
                data: { balance: { increment: dto.amount } },
            });

            // Create transaction registry
            const transaction = await tx.transaction.create({
                data: {
                    idempotencyKey: dto.idempotencyKey || null,
                    type: TransactionType.DEPOSIT,
                    status: TransactionStatus.COMPLETED,
                    amount: new Prisma.Decimal(dto.amount),
                    currency: dto.currency,
                    description: dto.description || "Deposit",
                    destinationAccountId: accountId,
                },
            });

            // Create inmutable ledger entry
            await tx.ledgerEntry.create({
                data: {
                    transactionId: transaction.id,
                    accountId: accountId,
                    amount: new Prisma.Decimal(dto.amount),
                    balanceAfter: updatedAccount.balance,
                },
            });

            const fullTx = await tx.transaction.findUnique({
                where: { id: transaction.id },
                include: { ledgerEntries: true },
            });

            return TransactionMapper.toDomain(fullTx!);
        });
    }

    // WITHRAWAL (Balance discount with verification + Ledger Entry (-))
    async executeWithdrawal(sourceAccountId: string, dto: WithdrawalDto): Promise<TransactionEntity> {
        return prisma.$transaction(async (tx) => {
            const sourceAcc = await tx.account.findUnique({
                where: { id: sourceAccountId }
            });

            if (!sourceAcc || sourceAcc.balance.toNumber() < dto.amount) {
                throw InvalidFieldsException("Insufficient funds for withdrawal");
            }

            const updatedAccount = await tx.account.update({
                where: { id: sourceAccountId },
                data: { balance: { decrement: dto.amount } },
            });

            const transaction = await tx.transaction.create({
                data: {
                    idempotencyKey: dto.idempotencyKey || null,
                    type: TransactionType.WITHDRAW,
                    status: TransactionStatus.COMPLETED,
                    amount: new Prisma.Decimal(dto.amount),
                    currency: dto.currency,
                    description: dto.description || "Withdrawal",
                    sourceAccountId: sourceAccountId,
                },
            });

            await tx.ledgerEntry.create({
                data: {
                    transactionId: transaction.id,
                    accountId: sourceAccountId,
                    amount: new Prisma.Decimal(-dto.amount),
                    balanceAfter: updatedAccount.balance,
                }
            });

            const fullTx = await tx.transaction.findUnique({
                where: { id: transaction.id },
                include: { ledgerEntries: true },
            });

            return TransactionMapper.toDomain(fullTx!);
        });
    }

    async executeTransfer(sourceAccountId: string, dto: TransferDto): Promise<TransactionEntity> {
        return prisma.$transaction(async (tx) => {
            const sourceAcc = await tx.account.findUnique({ where: { id: sourceAccountId } });

            if (!sourceAcc || sourceAcc.balance.toNumber() < dto.amount) {
                throw InvalidFieldsException("Insufficient funds");
            }

            const updatedSource = await tx.account.update({
                where: { id: sourceAccountId },
                data: { balance: { decrement: dto.amount } },
            });

            const updatedDest = await tx.account.update({
                where: { id: dto.destinationAccountId },
                data: { balance: { increment: dto.amount } },
            });

            const transaction = await tx.transaction.create({
                data: {
                    idempotencyKey: dto.idempotencyKey || null,
                    type: TransactionType.TRANSFER,
                    status: TransactionStatus.COMPLETED,
                    amount: new Prisma.Decimal(dto.amount),
                    currency: dto.currency,
                    description: dto.description || "Transfer",
                    sourceAccountId: sourceAccountId,
                    destinationAccountId: dto.destinationAccountId,
                }
            });

            await tx.ledgerEntry.createMany({
                data: [
                    {
                        transactionId: transaction.id,
                        accountId: sourceAccountId,
                        amount: new Prisma.Decimal(-dto.amount),
                        balanceAfter: updatedSource.balance,
                    },
                    {
                        transactionId: transaction.id,
                        accountId: dto.destinationAccountId,
                        amount: new Prisma.Decimal(dto.amount),
                        balanceAfter: updatedDest.balance,
                    },
                ],
            });

            const fullTx = await tx.transaction.findUnique({
                where: { id: transaction.id },
                include: { ledgerEntries: true },
            });

            return TransactionMapper.toDomain(fullTx!);
        });
    }
}