import type { Currency } from "@prisma/client";
import { HTTP_STATUS } from "../../constants/httpStatus";
import type { AuthRequest } from "../../middlewares/auth.middleware";
import { ApiResponse } from "../../utils/apiResponse";
import { asyncHandler } from "../../utils/asyncHandler";
import { getAccountByCurrency, getUserAccounts } from "./account.service";

export const getUserAccountsController = asyncHandler(async (req: AuthRequest, res) => {
    const userId = req.userId!;
    const accounts = await getUserAccounts(userId);

    return res.status(HTTP_STATUS.OK).json(
        ApiResponse.success("User accounts retrieved successfully", accounts)
    );
});

export const getAccountByCurrencyController = asyncHandler(async (req: AuthRequest, res) => {
    const userId = req.userId!;
    const currency = req.params.currency as Currency;

    const account = await getAccountByCurrency(userId, currency);

    return res.status(HTTP_STATUS.OK).json(
        ApiResponse.success(`Account in ${currency} retrieved successfully`, account)
    )
});