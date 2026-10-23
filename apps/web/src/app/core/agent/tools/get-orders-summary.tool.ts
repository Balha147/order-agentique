
import { z } from 'zod';
import { OrderService } from '../../../features/orders/service/order';


interface GetOrdersSummaryDependencies {
    orderService: OrderService;
}

export function createGetOrdersSummaryTool({
    orderService,
}: GetOrdersSummaryDependencies) {
    return {
        name: 'getOrdersSummary',
        description:
            'Get a summary of all orders, including counts by status and total order value.',
        parameters: z.object({}),
        handler: async () => {
            const orders = orderService.orders();

            const summary = {
                totalOrders: orders.length,
                pending: orders.filter((order) => order.status === 'pending').length,
                shipped: orders.filter((order) => order.status === 'shipped').length,
                delivered: orders.filter((order) => order.status === 'delivered').length,
                totalValue: orders.reduce((total, order) => total + order.total, 0),
            };

            return {
                success: true,
                summary,
            };
        },
    };
}
