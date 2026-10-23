import { cors } from 'hono/cors';
import { config } from '../config/config.js';

export const corsMiddleware = cors({
    origin: config.frontendUrl,
    allowMethods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
    allowHeaders: [
        'Content-Type',
        'Authorization',
        'x-copilotkit-runtime-version',
        'x-copilotkit-sdk-version',
    ],
    exposeHeaders: ['Content-Type'],
});