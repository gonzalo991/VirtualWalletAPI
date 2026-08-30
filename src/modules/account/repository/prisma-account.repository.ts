import type { Currency } from "@prisma/client";
import type { AccountEntity } from "../entity/Account.entity";
import type { IAccountRepository } from "./account.repository.interface";
import { prisma } from "../../../lib/prisma";
import { AccountMapper } from "../response/account.mapper";

export class PrismaAccountRepository implements IAccountRepository {
    async createDefaultAccounts(userId: string, currencies: Currency[], tx?: any): Promise<AccountEntity[]> {
        const db = prisma || tx;
        const accountsData = currencies.map((currency) => ({
            userId,
            currency,
            balance: 0,
        }));

        await db.account.createMany({
            data: accountsData,
            skipDuplicates: true,
        });

        const prismaAccounts = await db.account.findMany({
            where: { userId },
        });

        return AccountMapper.toDomainList(prismaAccounts);
    }

    async findByUserId(userId: string): Promise<AccountEntity[]> {
        const prismaAccounts = await prisma.account.findMany({
            where: { userId }
        });

        return AccountMapper.toDomainList(prismaAccounts);
    }

    async findByUserIdAndCurrency(userId: string, currency: Currency): Promise<AccountEntity | null> {
        const prismaAccount = await prisma.account.findUnique({
            where: {
                userId_currency: {
                    userId,
                    currency,
                },
            },
        });

        return prismaAccount ? AccountMapper.toDomain(prismaAccount) : null;
    }

    async findById(id: string): Promise<AccountEntity | null> {
        const prismaAccount = await prisma.account.findUnique({
            where: { id },
        });

        return prismaAccount ? AccountMapper.toDomain(prismaAccount) : null;
    }
}