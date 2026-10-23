import { serve } from '@hono/node-server';
import { createApp } from './infrastructure/http/app.js';
import { config } from './infrastructure/config/config.js';

const app = await createApp();

serve(
    {
        fetch: app.fetch,
        port: config.port,
    },
    (info) => {
        console.log(
            `✅ order-agent server running on http://localhost:${info.port}`,
        );
    },
);