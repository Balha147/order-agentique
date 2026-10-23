
import { InMemoryStore } from '@mastra/core/storage';
import { Memory } from '@mastra/memory';
import { z } from 'zod';

export const orderAgentStateSchema = z.object({
    currentView: z.enum(['orders-list', 'order-details', 'analytics']).optional(),
    selectedOrderId: z.string().optional(),
    activeFilters: z.object({
        status: z.enum(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']).optional(),
        search: z.string().optional(),
    }).optional(),
    lastUserIntent: z.string().optional(),
});

export const storage = new InMemoryStore();
export const agentMemory = new Memory({
    storage,
    options: {
        lastMessages: 20,
        workingMemory: {
            enabled: true,
            schema: orderAgentStateSchema,
        },
    },
});
