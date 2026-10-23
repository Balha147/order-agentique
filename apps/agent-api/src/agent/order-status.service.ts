import { Order, OrderStatus, orders } from "./data.js";

export type UpdateOrderStatusResult =
    | { success: true; order: Order }
    | { success: false; error: string; code: 'NOT_FOUND' | 'INVALID_TRANSITION' };

const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
    pending: ['shipped'],
    shipped: ['delivered'],
    delivered: [],
};

export function updateOrderStatus(
    orderId: string,
    newStatus: OrderStatus,
): UpdateOrderStatusResult {
    const order = orders.find((item) => item.id === orderId);

    if (!order) {
        return {
            success: false,
            code: 'NOT_FOUND',
            error: `La commande ${orderId} n'existe pas.`,
        };
    }

    if (!allowedTransitions[order.status].includes(newStatus)) {
        return {
            success: false,
            code: 'INVALID_TRANSITION',
            error: `La transition du statut "${order.status}" vers "${newStatus}" n'est pas autorisée.`,
        };
    }

    order.status = newStatus;

    return { success: true, order };
}
