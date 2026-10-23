
import { MastraAgent } from '@ag-ui/mastra';
import { orderAgent } from '../agent/order-agent.js';

export const RESOURCE_ID = 'order-management';

export function createOrderAguiAgent(threadId: string) {
    return new MastraAgent({
        agent: orderAgent,
        resourceId: RESOURCE_ID,
        threadId,
    });
}
