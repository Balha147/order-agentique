
import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

import { orders } from '../agent/data.js';
import {
    updateOrderStatus as updateOrderStatusService,
} from '../agent/order-status.service.js';

export const updateOrderStatus = createTool({
    id: 'update-order-status',

    description:
        'Update an order status if the requested transition is allowed, then return the complete updated order list.',

    inputSchema: z.object({
        orderId: z.string().trim().min(1).describe(
            'The ID of the order to update, e.g. ORD-1001',
        ),
        status: z.enum(['shipped', 'delivered']).describe(
            'The requested new order status',
        ),
    }),

    execute: async ({ orderId, status }) => {
        const result = updateOrderStatusService(orderId, status);

        if (!result.success) {
            return {
                success: false,
                message: result.error,
                code: result.code,
            };
        }

        return {
            success: true,
            message: `Order ${result.order.id} status updated successfully.`,
            orders: [...orders],
        };
    },
});
