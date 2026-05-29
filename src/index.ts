import app from './app.js';
import { config } from 'dotenv';
import { logger } from './lib/logger.js';
config();

const PORT: number = Number(process.env.PORT) || 8080;

app.listen(PORT, () => logger.info(`✅ Server running on port: ${PORT} 🚀`));