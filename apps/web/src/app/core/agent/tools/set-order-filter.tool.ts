
import { z } from 'zod';
import { OrderUiService } from '../../../features/orders/service/order-ui';

interface SetOrderFilterDependencies {
    orderUiService: OrderUiService;
}

export function createSetOrderFilterTool({
    orderUiService,
}: SetOrderFilterDependencies) {
    return {
        name: 'setOrderFilter',
        description: 'Filter the orders dashboard by status, or show all orders.',
        parameters: z.object({
            status: z
                .enum(['all', 'pending', 'shipped', 'delivered'])
                .describe('The status to filter by, or all to show every order'),
        }),
        handler: async ({ status }: { status: 'all' | 'pending' | 'shipped' | 'delivered' }) => {
            orderUiService.setSelectedStatus(status);

            return {
                success: true,
                message:
                    status === 'all'
                        ? 'All orders are now displayed.'
                        : `Orders filtered by status: ${status}.`,
                selectedStatus: status,
            };
        },
    };
}
