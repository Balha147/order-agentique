
import { DestroyRef, inject, Service } from '@angular/core';
import { injectAgentStore } from '@copilotkit/angular';

import type { Order } from '../../features/orders/models/order.model';
import { OrderService } from '../../features/orders/service/order';

@Service()
export class OrderAgentEventsService {
    private readonly orderService = inject(OrderService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly agentStore = injectAgentStore('orderManagementAgent');

    private readonly toolNames = new Map<string, string>();

    constructor() {
        const subscription = this.agentStore().agent.subscribe({
            onRunStartedEvent: ({ event }) => {
                console.log('[AG-UI] RUN STARTED:', event);

                this.toolNames.clear();
                this.orderService.startAgentRun();
            },

            onStepStartedEvent: () => {
                this.orderService.updateAgentProgress(`L'agent prépare la suite du traitement...`);
            },

            onToolCallStartEvent: ({ event }) => {
                console.log('[AG-UI] TOOL START:', event);

                if (event.type !== 'TOOL_CALL_START') {
                    return;
                }

                this.toolNames.set(event.toolCallId, event.toolCallName);

                this.orderService.updateAgentProgress(`L'agent exécute l'outil ${event.toolCallName}...`);
            },

            onToolCallResultEvent: ({ event }) => {
                console.log('[AG-UI] TOOL RESULT:', event);

                if (event.type !== 'TOOL_CALL_RESULT') {
                    return;
                }

                const toolName = this.toolNames.get(event.toolCallId);
                this.toolNames.delete(event.toolCallId);

                if (typeof event.content !== 'string') {
                    console.warn('[AG-UI] Résultat non textuel reçu.');
                    this.orderService.updateAgentProgress(`L'outil a retourné un résultat non textuel.`);
                    return;
                }

                try {
                    const result: {
                        success?: boolean;
                        message?: string;
                        orders?: unknown;
                        proposalId?: string;
                        order?: Order | {
                            customer: string;
                            items: string[];
                            total: number;
                        };
                    } = JSON.parse(event.content);

                    if (toolName === 'getOrders') {
                        if (!Array.isArray(result.orders)) {
                            throw new Error('Invalid orders result');
                        }

                        this.orderService.setOrdersFromAgent(event.content);
                        this.orderService.updateAgentProgress(
                            'Commandes récupérées.',
                        );
                        return;
                    }

                    if (toolName === 'updateOrderStatus' || toolName === 'update-order-status') {
                        if (result.success && result.order && 'id' in result.order) {
                            this.orderService.updateOrderInState(result.order as Order);

                            this.orderService.updateAgentProgress(`Commande ${result.order.id} mise à jour.`);
                            return;
                        }

                        const message = result.message ?? 'La mise à jour de la commande a échoué.';
                        this.orderService.setError(message);
                        this.orderService.updateAgentProgress(`Erreur : ${message}`);
                        return;
                    }

                    if (toolName === 'prepareOrder' || toolName === 'prepare-order') {
                        if (result.success && result.proposalId && result.order) {
                            this.orderService.setOrderProposalFromAgent(event.content);
                        } else {
                            const message = result.message ?? 'La préparation de la commande a échoué.';
                            this.orderService.setError(message);
                            this.orderService.updateAgentProgress(`Erreur : ${message}`);
                        }
                        return;
                    }

                    this.orderService.updateAgentProgress('Résultat reçu, traitement en cours…');
                } catch (error) {
                    console.error('[AG-UI] Erreur de traitement du résultat :', error);
                    const message = 'Impossible de traiter le résultat de l’agent.';

                    this.orderService.setError(message);
                    this.orderService.updateAgentProgress(`Erreur : ${message}`);
                }
            },

            onRunFinishedEvent: ({ event }) => {
                console.log('[AG-UI] RUN FINISHED:', event);

                this.orderService.finishAgentRun();
                this.toolNames.clear();
            },

            onRunErrorEvent: ({ event }) => {
                console.error('[AG-UI] RUN ERROR:', event);

                this.orderService.failAgentRun(
                    'Une erreur est survenue pendant le traitement.',
                );
                this.toolNames.clear();
            },
        });

        this.destroyRef.onDestroy(() => {
            subscription.unsubscribe();
            this.toolNames.clear();
        });
    }
}
