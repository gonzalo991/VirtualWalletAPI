import type { DepositDto } from "../dto/Deposit.dto";
import type { TransferDto } from "../dto/Transfer.dto";
import type { WithdrawalDto } from "../dto/Withdrawal.dto";
import type { TransactionEntity } from "../entity/Transaction.entity";

export interface ITransactionRepository {
    findByIdempotencyKey(key: string): Promise<TransactionEntity | null>;
    findById(id: string): Promise<TransactionEntity | null>;
    findByAccountId(accountId: string): Promise<TransactionEntity[]>;

    executeDeposit(accountId: string, dto: DepositDto): Promise<TransactionEntity>;
    executeWithdrawal(accountId: string, dto: WithdrawalDto): Promise<TransactionEntity>;
    executeTransfer(sourceAccountId: string, dto: TransferDto): Promise<TransactionEntity>;
}