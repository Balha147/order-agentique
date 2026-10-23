
import { z } from 'zod';
import { OrderUiService } from '../../../features/orders/service/order-ui';

interface ClearOrderSelectionDependencies {
    orderUiService: OrderUiService;
}

export function createClearOrderSelectionTool({
    orderUiService,
}: ClearOrderSelectionDependencies) {
    return {
        name: 'clearOrderSelection',
        description: 'Clear the selected order and close the order details panel.',
        parameters: z.object({}),
        handler: async () => {
            orderUiService.clearSelectedOrder();

            return {
                success: true,
                message: 'Order selection cleared.',
            };
        },
    };
}
