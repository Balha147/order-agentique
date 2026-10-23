import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { orders } from '../agent/data.js';


export const getOrderDetails = createTool({
    id: 'get-order-details',
    description:
        'Retrieve the full details of a specific order using its exact order ID.',

    inputSchema: z.object({
        orderId: z
            .string()
            .min(1)
            .describe('The order ID, for example ORD-1002'),
    }),

    execute: async ({ orderId }) => {
        const order = orders.find(
            (item) => item.id.toLowerCase() === orderId.trim().toLowerCase(),
        );

        if (!order) {
            return {
                found: false,
                message: `No order found with ID ${orderId}.`,
            };
        }

        return {
            found: true,
            order,
        };
    },
});