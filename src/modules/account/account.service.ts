import { Currency } from "@prisma/client";
import type { AccountResponse } from "./dto/AccountResponse.dto";
import { PrismaAccountRepository } from "./repository/prisma-account.repository";
import { AccountMapper } from "./response/account.mapper";
import { NotFoundException, ServiceException } from "../../exceptions/Exception";
import { logger } from "../../lib/logger";

const accountRepository = new PrismaAccountRepository();

export const createDefaultAccounts = async (userId: string, tx?: any): Promise<AccountResponse[]> => {
    try {
        const currencies: Currency[] = [Currency.ARS, Currency.USD, Currency.USDT, Currency.ETH];
        const accountEntities = await accountRepository.createDefaultAccounts(userId, currencies, tx);

        if (!accountEntities) {
            throw ServiceException(`Accounts creation failed. Try again...`);
        }

        logger.info(`[Create Default Accounts] Accounts for user with id: ${userId} created.`);
        return AccountMapper.toResponseList(accountEntities);
    } catch (error) {
        logger.error(`[Create Default Accounts] Error creating user accounts.`)
        throw error;
    }
}

export const getUserAccounts = async (userId: string): Promise<AccountResponse[]> => {
    try {
        const accountEntities = await accountRepository.findByUserId(userId);

        if (!accountEntities) {
            throw NotFoundException(`Accounts for id: ${userId} not found.`);
        }

        logger.info(`[Get User Accounts] Serving accounts for user with id: ${userId}`);
        return AccountMapper.toResponseList(accountEntities);
    } catch (error) {
        logger.error(`[Get User Accounts] Error serving accounts for id : ${userId}.`);
        throw error;
    }
}

export const getAccountByCurrency = async (userId: string, currency: Currency): Promise<AccountResponse> => {
    try {
        const accountEntity = await accountRepository.findByUserIdAndCurrency(userId, currency);

        if (!accountEntity) {
            throw NotFoundException(`Account for currency ${currency} and id: ${userId} not found.`);
        }

        return AccountMapper.toResponse(accountEntity);
    } catch (error) {
        logger.error(`[Get Account By Currency] Error serving account for currency: ${currency}`);
        throw error;
    }
}