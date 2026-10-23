
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import {
    AgentOrdersResult,
    CancelProposalResponse,
    EditableOrder,
    Order,
    OrderProposal,
    ProposalResponse,
} from '../models/order.model';
import { API_ENDPOINTS } from '../../../app.config';

@Service()
export class OrderService {
    private readonly http = inject(HttpClient);

    private readonly proposalApiUrl = API_ENDPOINTS.orderProposals;

    private readonly ordersState = signal<Order[]>([]);
    readonly orders = this.ordersState.asReadonly();

    private readonly loadingState = signal(false);
    readonly isLoading = this.loadingState.asReadonly();

    private readonly errorState = signal<string | null>(null);
    readonly error = this.errorState.asReadonly();

    readonly agentTimeline = signal<string[]>([]);
    readonly agentRunning = signal(false);
    readonly agentProgress = signal("En attente de l'agent…");

    readonly pendingOrderProposal = signal<OrderProposal | null>(null);
    readonly proposalSubmitting = signal(false);

    // ---------- Timeline de l'agent ----------

    private addTimelineStep(message: string): void {
        this.agentTimeline.update((steps) => {
            if (steps.at(-1) === message) {
                return steps;
            }

            return [...steps, message];
        });
    }

    startAgentRun(): void {
        this.agentRunning.set(true);
        this.loadingState.set(true);
        this.errorState.set(null);
        this.agentTimeline.set([]);

        this.updateAgentProgress('L’agent démarre le traitement…');
    }

    updateAgentProgress(message: string): void {
        this.agentProgress.set(message);
        this.addTimelineStep(message);
    }

    finishAgentRun(): void {
        this.agentRunning.set(false);
        this.loadingState.set(false);
        this.updateAgentProgress('Traitement terminé.');
    }

    failAgentRun(message: string): void {
        this.agentRunning.set(false);
        this.loadingState.set(false);
        this.errorState.set(message);

        this.agentProgress.set(message);
        this.addTimelineStep(
            message.startsWith('Erreur :') ? message : `Erreur : ${message}`,
        );
    }

    setLoading(isLoading: boolean): void {
        this.loadingState.set(isLoading);
    }

    setError(message: string): void {
        this.errorState.set(message);
    }

    // ---------- Résultats des outils de l'agent ----------

    setOrdersFromAgent(content: string): void {
        try {
            const result = JSON.parse(content) as AgentOrdersResult;

            if (!Array.isArray(result.orders)) {
                throw new Error('Invalid orders result');
            }

            this.ordersState.set(result.orders);
            this.errorState.set(null);
        } catch (error) {
            console.error('[OrderService] Invalid orders result:', error);

            this.setError(`Impossible de lire les commandes retournées par l'agent.`);
        } finally {
            this.loadingState.set(false);
        }
    }

    setOrderProposalFromAgent(content: string): void {
        try {
            const result: {
                success?: boolean;
                proposalId?: string;
                order?: OrderProposal['order'];
                message?: string;
            } = JSON.parse(content);

            const order = result.order;

            if (
                !result.success ||
                !result.proposalId ||
                !order ||
                typeof order.customer !== 'string' ||
                !order.customer.trim() ||
                !Array.isArray(order.items) ||
                order.items.length === 0 ||
                !order.items.every(
                    (item) => typeof item === 'string' && item.trim().length > 0,
                ) ||
                !Number.isFinite(order.total) ||
                order.total <= 0
            ) {
                throw new Error(result.message ?? 'Invalid order proposal');
            }

            this.pendingOrderProposal.set({
                proposalId: result.proposalId,
                order,
            });

            this.errorState.set(null);
            this.updateAgentProgress('Proposition de commande en attente de confirmation.');
        } catch (error) {
            console.error('[OrderService] Invalid order proposal:', error);

            const message = 'Impossible de lire la proposition de commande.';

            this.setError(message);
            this.updateAgentProgress(`Erreur : ${message}`);
        }
    }

    // ---------- Confirmation et annulation des propositions ----------

    async confirmOrderProposal(proposalId: string, order: EditableOrder): Promise<Order> {
        if (this.proposalSubmitting()) {
            throw new Error('Une opération sur la proposition est déjà en cours.');
        }

        const proposal = this.pendingOrderProposal();

        if (!proposal || proposal.proposalId !== proposalId) {
            throw new Error(
                'Aucune proposition correspondante à confirmer.',
            );
        }

        this.proposalSubmitting.set(true);
        this.errorState.set(null);

        try {
            const response = await firstValueFrom(
                this.http.post<ProposalResponse>(
                    `${this.proposalApiUrl}/${encodeURIComponent(proposalId)}/confirm`,
                    { order },
                ),
            );

            if (!response.order?.id) {
                throw new Error('Réponse de confirmation invalide.');
            }

            this.upsertOrderInState(response.order);
            this.pendingOrderProposal.set(null);

            this.updateAgentProgress(
                `Commande ${response.order.id} créée avec succès.`,
            );

            return response.order;
        } catch (error: unknown) {
            const message = this.getProposalErrorMessage(error);
            this.setError(message);
            this.updateAgentProgress(`Erreur : ${message}`);
            throw error;
        } finally {
            this.proposalSubmitting.set(false);
        }
    }

    async cancelOrderProposal(proposalId: string): Promise<void> {
        if (this.proposalSubmitting()) {
            throw new Error('Une opération sur la proposition est déjà en cours.');
        }

        const proposal = this.pendingOrderProposal();

        if (!proposal || proposal.proposalId !== proposalId) {
            throw new Error(
                'Aucune proposition correspondante à annuler.',
            );
        }

        this.proposalSubmitting.set(true);
        this.errorState.set(null);

        try {
            await firstValueFrom(
                this.http.delete<CancelProposalResponse>(
                    `${this.proposalApiUrl}/${encodeURIComponent(proposalId)}`,
                ),
            );

            this.pendingOrderProposal.set(null);
            this.updateAgentProgress('Proposition de commande annulée.');
        } catch (error: unknown) {
            const message = this.getProposalErrorMessage(error);
            this.setError(message);
            this.updateAgentProgress(`Erreur : ${message}`);
            throw error;
        } finally {
            this.proposalSubmitting.set(false);
        }
    }

    // ---------- Mise à jour locale des commandes ----------

    updateOrderInState(updatedOrder: Order): void {
        this.ordersState.update((orders: Order[]) =>
            orders.map((order: Order) =>
                order.id === updatedOrder.id ? updatedOrder : order,
            ),
        );

        this.errorState.set(null);
    }

    private upsertOrderInState(order: Order): void {
        this.ordersState.update((orders: Order[]) => {
            const exists = orders.some((item: Order) => item.id === order.id);

            if (exists) {
                return orders.map((item: Order) =>
                    item.id === order.id ? order : item,
                );
            }

            return [order, ...orders];
        });
    }

    private getProposalErrorMessage(error: unknown): string {
        if (error instanceof HttpErrorResponse) {
            if (error.status === 404) {
                return 'Cette proposition est introuvable ou a déjà été traitée.';
            }

            if (error.status === 0) {
                return 'Le serveur est inaccessible. Réessaie plus tard.';
            }

            return 'Impossible de traiter la proposition de commande.';
        }

        return 'Une erreur inattendue est survenue.';
    }
}
