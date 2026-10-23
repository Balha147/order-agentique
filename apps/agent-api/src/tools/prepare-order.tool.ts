
import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

import { prepareOrderProposal } from '../agent/order-proposal.service.js';

export const prepareOrder = createTool({
    id: 'prepare-order',
    description: `
Prepare a new order proposal for the user to review.
Use this tool when the user asks to create a new order.
This tool does not create or save an actual order.
The user must explicitly confirm the proposal through the application.
`,
    inputSchema: z.object({
        customer: z.string().trim().min(1).describe('Customer name'),
        items: z
            .array(z.string().trim().min(1))
            .min(1)
            .describe('List of items in the order'),
        total: z.number().positive().finite().describe('Total order amount'),
    }),

    execute: async ({ customer, items, total }) => {
        console.group('[Mastra] prepare-order');

        console.log('TOOL_CALL_START');
        console.log('TOOL_CALL_ARGS:', {
            customer,
            items,
            total,
        });

        const result = prepareOrderProposal({
            customer,
            items,
            total,
        });

        if (!result.success) {
            const toolResult = {
                success: false,
                message: result.error,
            };

            console.log('TOOL_CALL_RESULT:', toolResult);
            console.groupEnd();

            return toolResult;
        }

        const toolResult = {
            success: true,
            message: 'Order proposal prepared. Waiting for user confirmation.',
            proposalId: result.proposalId,
            order: result.order,
        };

        console.log('TOOL_CALL_RESULT:', toolResult);
        console.groupEnd();

        return toolResult;
    },

});
