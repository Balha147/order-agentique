import { Agent } from '@mastra/core/agent';
import { agentMemory } from '../infrastructure/mastra/memory.js';
import { ORDER_AGENT_INSTRUCTIONS } from '../prompts/instructions.js';
import { getOrders } from '../tools/get-orders.js';
import { getOrderDetails } from '../tools/get-order-details.js';
import { updateOrderStatus } from '../tools/update-order-status.js';
import { prepareOrder } from '../tools/prepare-order.tool.js';


export const orderAgent = new Agent({
    id: 'orderAgent',
    name: 'Order Management Agent',
    instructions: ORDER_AGENT_INSTRUCTIONS.trim(),

    model: [
        {
            model: 'google/gemini-3.5-flash-lite',
            maxRetries: 2,
        },
        {
            model: 'google/gemini-2.5-flash',
            maxRetries: 2,
        },
    ],
    tools: {
        getOrders,
        getOrderDetails,
        updateOrderStatus,
        prepareOrder
    },
    memory: agentMemory,
});