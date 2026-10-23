
import type { Context } from 'hono';

import {
    cancelOrderProposal,
    confirmOrderProposal,
} from '../agent/order-proposal.service.js';

export async function confirmOrderProposalRoute(c: Context) {
    const proposalId = c.req.param('id');

    const result = confirmOrderProposal(proposalId as string);

    if (!result.success) {
        const status = result.code === 'PROPOSAL_NOT_FOUND' ? 404 : 500;

        return c.json(
            {
                error: result.error,
                code: result.code,
            },
            status,
        );
    }

    return c.json(
        {
            order: result.order,
        },
        201,
    );
}

export async function cancelOrderProposalRoute(c: Context) {
    const proposalId = c.req.param('id');

    const cancelled = cancelOrderProposal(proposalId as string);

    if (!cancelled) {
        return c.json(
            {
                error: 'Proposition introuvable ou déjà traitée.',
                code: 'PROPOSAL_NOT_FOUND',
            },
            404,
        );
    }

    return c.json(
        {
            success: true,
        },
        200,
    );
}
