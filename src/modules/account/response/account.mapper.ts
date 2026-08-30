import type { AccountResponse } from "../dto/AccountResponse.dto";
import { AccountEntity } from "../entity/Account.entity";
import type { Account as PrismaAccount } from "@prisma/client";

export class AccountMapper {
    static toDomain(prismaAccount: PrismaAccount): AccountEntity {
        return new AccountEntity(
            prismaAccount.id,
            prismaAccount.userId,
            prismaAccount.currency,
            prismaAccount.balance.toString(),
            prismaAccount.status,
            prismaAccount.createdAt,
            prismaAccount.updatedAt
        )
    }

    static toDomainList(prismaAccounts: PrismaAccount[]): AccountEntity[] {
        return prismaAccounts.map(this.toDomain);
    }

    static toResponse(entity: AccountEntity): AccountResponse {
        return {
            id: entity.id,
            userId: entity.userId,
            currency: entity.currency,
            balance: entity.balance,
            status: entity.status,
            createdAt: entity.createdAt,
        }
    }

    static toResponseList(entities: AccountEntity[]): AccountResponse[] {
        return entities.map(this.toResponse);
    }
}