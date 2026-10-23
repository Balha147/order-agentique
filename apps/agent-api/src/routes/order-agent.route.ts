import type { Context } from 'hono';
import { streamSSE } from 'hono/streaming';
import { concatMap, lastValueFrom, type Observable } from 'rxjs';

import { agentMemory } from '../infrastructure/mastra/memory.js';
import {
    createOrderAguiAgent,
    RESOURCE_ID,
} from './order-agent.agui.config.js';

type OrderAguiAgent = ReturnType<typeof createOrderAguiAgent>;
type AgentRunInput = Parameters<OrderAguiAgent['run']>[0];

export async function orderAgentRoute(c: Context): Promise<Response> {
    const input = (await c.req.json()) as AgentRunInput;
    const threadId = input.threadId;

    if (!threadId) {
        return c.json({ error: 'threadId is required' }, 400);
    }

    const existingThread = await agentMemory.getThreadById({
        threadId,
    });

    if (!existingThread) {
        console.log(`[MEMORY] Création du thread ${threadId}`);

        await agentMemory.createThread({
            threadId,
            resourceId: RESOURCE_ID,
            title: 'Order Management Conversation',
        });
    }

    const orderAguiAgent = createOrderAguiAgent(threadId);

    return streamSSE(c, async (sse) => {
        const send = (event: unknown): Promise<void> =>
            sse.writeSSE({
                data: JSON.stringify(event),
            });

        const events$ = orderAguiAgent.run(input) as unknown as Observable<unknown>;

        await lastValueFrom(
            events$.pipe(
                concatMap(async (event) => {
                    const data =
                        typeof event === 'object' && event !== null
                            ? (event as Record<string, unknown>)
                            : undefined;

                    const eventType = String(data?.type ?? 'UNKNOWN_EVENT');

                    console.log(
                        `[AG-UI] ${eventType}`,
                        JSON.stringify(event, null, 2),
                    );

                    await send(event);
                }),
            ),
            { defaultValue: undefined },
        );
    });
}

