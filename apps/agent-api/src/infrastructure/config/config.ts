import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
    PORT: z.coerce.number().int().positive().default(4555),
    FRONTEND_URL: z.string().url().default('http://localhost:4200'),
    GOOGLE_API_KEY: z.string().min(1).optional(),
});

const env = envSchema.parse(process.env);

export const config = {
    port: env.PORT,
    frontendUrl: env.FRONTEND_URL,
    googleApiKey: env.GOOGLE_API_KEY,
};