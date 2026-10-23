import { Hono } from 'hono';
import { logger } from 'hono/logger';
import type { HonoBindings, HonoVariables } from '@mastra/hono';
import { MastraServer } from '@mastra/hono';

import { corsMiddleware } from './cors.js';
import { mastra } from '../mastra/mastra.js';
import { orderAgentRoute } from '../../routes/order-agent.route.js';
import { updateOrderStatusRoute } from '../../routes/update-order-status.route.js';
import { confirmOrderProposalRoute, cancelOrderProposalRoute } from '../../routes/order-proposal.routes.js';

export async function createApp() {
    const app = new Hono<{
        Bindings: HonoBindings;
        Variables: HonoVariables;
    }>();

    app.use('*', logger());
    app.use('*', corsMiddleware);

    app.patch('/api/orders/:id/status', updateOrderStatusRoute);
    app.post('/api/ag-ui', orderAgentRoute);
    app.post('/api/orders/proposals/:id/confirm', confirmOrderProposalRoute);

    app.delete('/api/orders/proposals/:id', cancelOrderProposalRoute);

    const server = new MastraServer({
        app,
        mastra,
    });
    await server.init();
    return app;
}