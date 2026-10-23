import { Order, orders } from "./data.js";

export interface CreateOrderInput {
    customer: string;
    items: string[];
    total: number;
}

export interface PreparedOrder {
    customer: string;
    items: string[];
    total: number;
}

export type PrepareOrderResult =
    | { success: true; order: PreparedOrder }
    | { success: false; error: string };

export function prepareOrder(input: CreateOrderInput): PrepareOrderResult {
    const customer = input.customer.trim();
    const items = input.items
        .map((item) => item.trim())
        .filter((item) => item.length > 0);

    if (!customer) {
        return {
            success: false,
            error: 'Le nom du client est obligatoire.',
        };
    }

    if (items.length === 0) {
        return {
            success: false,
            error: 'La commande doit contenir au moins un article.',
        };
    }

    if (!Number.isFinite(input.total) || input.total <= 0) {
        return {
            success: false,
            error: 'Le montant doit être supérieur à zéro.',
        };
    }

    return {
        success: true,
        order: {
            customer,
            items,
            total: input.total,
        },
    };
}


export function createOrder(input: CreateOrderInput): Order | null {
    const result = prepareOrder(input);

    if (!result.success) {
        return null;
    }

    const nextId = Math.max(
        1000,
        ...orders.map((order: Order) => {
            const match = /^ORD-(\d+)$/.exec(order.id);
            return match ? Number(match[1]) : 1000;
        }),
    ) + 1;

    const order: Order = {
        id: `ORD-${nextId}`,
        customer: result.order.customer,
        items: result.order.items,
        total: result.order.total,
        status: 'pending',
        createdAt: new Date().toISOString().slice(0, 10),
    };

    orders.push(order);

    return order;
}

