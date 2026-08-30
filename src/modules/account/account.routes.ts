import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { getAccountByCurrencyController, getUserAccountsController } from "./account.controller";
import { validate } from "../../middlewares/validation.middleware";
import { getAccountByCurrencySchema } from "./account.schemas";

const accountRouter: Router = Router();

accountRouter.use(authMiddleware);

accountRouter.get(
    "/",
    getUserAccountsController
);

accountRouter.get(
    "/:currency",
    validate(getAccountByCurrencySchema),
    getAccountByCurrencyController
);

export default accountRouter;