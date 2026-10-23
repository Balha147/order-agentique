
import { randomUUID } from 'node:crypto';

import type { Order } from './data.js';
import { createOrder } from './order-creation.service.js';

export interface OrderProposalInput {
    customer: string;
    items: string[];
    total: number;
}

export interface PendingOrderProposal {
    proposalId: string;
    order: OrderProposalInput;
}

type PrepareProposalResult =
    | {
        success: true;
        proposalId: string;
        order: OrderProposalInput;
    }
    | {
        success: false;
        error: string;
    };

type ConfirmProposalResult =
    | {
        success: true;
        order: Order;
    }
    | {
        success: false;
        code: 'PROPOSAL_NOT_FOUND' | 'CREATION_FAILED';
        error: string;
    };

const pendingProposals = new Map<string, PendingOrderProposal>();

export function prepareOrderProposal(
    input: OrderProposalInput,
): PrepareProposalResult {
    const customer = input.customer.trim();
    const items = input.items.map((item) => item.trim());
    const total = input.total;

    if (!customer) {
        return {
            success: false,
            error: 'Le nom du client est obligatoire.',
        };
    }

    if (items.length === 0 || items.some((item) => !item)) {
        return {
            success: false,
            error: 'La commande doit contenir au moins un article valide.',
        };
    }

    if (!Number.isFinite(total) || total <= 0) {
        return {
            success: false,
            error: 'Le montant total doit être strictement positif.',
        };
    }

    const proposal: PendingOrderProposal = {
        proposalId: randomUUID(),
        order: { customer, items, total },
    };

    pendingProposals.set(proposal.proposalId, proposal);

    return {
        success: true,
        proposalId: proposal.proposalId,
        order: proposal.order,
    };
}

export function confirmOrderProposal(
    proposalId: string,
): ConfirmProposalResult {
    const proposal = pendingProposals.get(proposalId);

    if (!proposal) {
        return {
            success: false,
            code: 'PROPOSAL_NOT_FOUND',
            error: 'Proposition introuvable ou déjà traitée.',
        };
    }

    const order = createOrder(proposal.order);

    if (!order) {
        return {
            success: false,
            code: 'CREATION_FAILED',
            error: 'Impossible de créer la commande.',
        };
    }

    pendingProposals.delete(proposalId);

    return {
        success: true,
        order,
    };
}

export function cancelOrderProposal(proposalId: string): boolean {
    return pendingProposals.delete(proposalId);
}
