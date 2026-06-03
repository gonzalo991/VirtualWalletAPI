import express, { type Express } from "express";
import router from "./modules/index.routes.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import morgan from "morgan";
import { apiRateLimit } from "./middlewares/rateLimit.middleware.js";

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(apiRateLimit);
app.use("/api", router);
app.use(errorMiddleware);

export default app;