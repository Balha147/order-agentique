
import { Mastra } from '@mastra/core/mastra';

import { storage } from './memory.js';
import { orderAgent } from '../../agent/order-agent.js';

export const agents = {
    orderAgent,
};

export const mastra = new Mastra({
    storage,
    agents,
});
