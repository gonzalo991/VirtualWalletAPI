import express, { type Express, type Request, type Response } from 'express';
import { config } from 'dotenv';
config();

const app: Express = express();
const PORT: number = Number(process.env.PORT) || 8080;

app.get('/', (_req: Request, res: Response) => {
    res.send('Hello, World!');
});

app.listen(PORT, () => console.log(`✅ Server running on port: ${PORT} 🚀`));