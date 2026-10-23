
import { z } from 'zod';
import type { Context } from 'hono';
import { updateOrderStatus } from '../agent/order-status.service.js';

const updateOrderStatusSchema = z.object({
    status: z.enum(['pending', 'shipped', 'delivered']),
});

export async function updateOrderStatusRoute(c: Context) {
    let body: unknown;

    try {
        body = await c.req.json();
    } catch {
        return c.json({ error: 'Corps JSON invalide.' }, 400);
    }

    const validation = updateOrderStatusSchema.safeParse(body);

    if (!validation.success) {
        return c.json(
            {
                error: 'Statut invalide.',
                details: validation.error.issues,
            },
            400,
        );
    }

    const orderId = c.req.param('id');
    const result = updateOrderStatus(orderId as string, validation.data.status);

    if (!result.success) {
        if (result.code === 'NOT_FOUND') {
            return c.json({ error: result.error }, 404);
        }

        return c.json({ error: result.error }, 409);
    }

    return c.json({ order: result.order }, 200);
}
