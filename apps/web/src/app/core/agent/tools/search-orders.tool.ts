
import { z } from 'zod';
import { OrderUiService } from '../../../features/orders/service/order-ui';


interface SearchOrdersDependencies {
    orderUiService: OrderUiService;
}

export function createSearchOrdersTool({
    orderUiService,
}: SearchOrdersDependencies) {
    return {
        name: 'searchOrders',
        description:
            'Search orders by order ID or customer name. Use an empty query to clear the search.',
        parameters: z.object({
            query: z
                .string()
                .describe('The order ID or customer name to search for'),
        }),
        handler: async ({ query }: { query: string }) => {
            orderUiService.setSearchTerm(query);

            return {
                success: true,
                message: query.trim()
                    ? `Orders search updated to: ${query}`
                    : 'Orders search cleared.',
                query,
            };
        },
    };
}
