import type { Currency } from "@prisma/client";
import type { AccountEntity } from "../entity/Account.entity";

export interface IAccountRepository {
    createDefaultAccounts(userId: string, currencies: Currency[], tx?:any): Promise<AccountEntity[]>;
    findByUserId(userId: string): Promise<AccountEntity[]>;
    findByUserIdAndCurrency(userId: string, currency: Currency): Promise<AccountEntity | null>;
    findById(id: string): Promise<AccountEntity | null>;
}