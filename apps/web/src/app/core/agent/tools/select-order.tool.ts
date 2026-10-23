
import { z } from 'zod';
import { Order } from '../../../features/orders/models/order.model';
import { OrderService } from '../../../features/orders/service/order';
import { OrderUiService } from '../../../features/orders/service/order-ui';

interface SelectOrderDependencies {
    orderService: OrderService;
    orderUiService: OrderUiService;
}

export function createSelectOrderTool({
    orderService,
    orderUiService,
}: SelectOrderDependencies) {
    return {
        name: 'selectOrder',
        description: 'Select an order in the Orders dashboard and display its details.',
        parameters: z.object({
            orderId: z.string().describe('The ID of the order to select, e.g. ORD-1001'),
        }),
        handler: async ({ orderId }: { orderId: string }) => {
            const order: Order | undefined = orderService
                .orders()
                .find((item: Order) => item.id === orderId);

            if (!order) {
                return {
                    success: false,
                    message: `Order ${orderId} was not found.`,
                };
            }

            orderUiService.selectOrder(orderId);

            return {
                success: true,
                message: `Order ${orderId} selected.`,
                order,
            };
        },
    };
}
