import express, { type Express } from "express";
import router from "./modules/index.routes.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", router);
app.use(errorMiddleware);

export default app;