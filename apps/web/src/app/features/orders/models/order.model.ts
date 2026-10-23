
export type OrderStatus = 'pending' | 'shipped' | 'delivered';

export interface Order {
    id: string;
    customer: string;
    items: string[];
    total: number;
    status: OrderStatus;
    createdAt: string;
}

export interface OrdersResponse {
    orders: Order[];
}

export interface AgentOrdersResult {
    orders: Order[];
}

export interface OrderProposal {
    proposalId: string;
    order: {
        customer: string;
        items: string[];
        total: number;
    };
}

export interface ProposalResponse {
    order: Order;
}

export interface CancelProposalResponse {
    success: boolean;
}

export type OrderProposalFormModel = Pick<Order, 'customer' | 'total'> & {
    itemsText: string;
};

export type EditableOrder = Pick<Order, 'customer' | 'items' | 'total'>;

export interface ConfirmOrderProposalEvent {
    proposalId: string;
    order: EditableOrder;
}