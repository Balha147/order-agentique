import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { orders } from '../agent/data.js';


export const getOrders = createTool({
    id: 'get-orders',
    description: `Retrieve the list of orders. Use this tool whenever
                 the user asks about orders, their status, or order totals.`,
    inputSchema: z.object({
        status: z
            .enum(['pending', 'shipped', 'delivered'])
            .optional()
            .describe('Optional status filter'),
    }),

    execute: async ({ status }) => {
        const filteredOrders = status
            ? orders.filter((order) => order.status === status)
            : orders;

        return {
            count: filteredOrders.length,
            orders: filteredOrders,
        };
    },
});