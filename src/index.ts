import app from './app.js';
import { config } from 'dotenv';
config();

const PORT: number = Number(process.env.PORT) || 8080;

app.listen(PORT, () => console.log(`✅ Server running on port: ${PORT} 🚀`));