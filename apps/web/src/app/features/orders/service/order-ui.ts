import { Service, signal } from '@angular/core';

import type { OrderStatus } from '../models/order.model';

export type OrderStatusFilter = OrderStatus | 'all';

@Service()
export class OrderUiService {
    private readonly searchTermState = signal('');

    readonly searchTerm = this.searchTermState.asReadonly();

    private readonly selectedStatusState = signal<OrderStatusFilter>('all');

    readonly selectedStatus = this.selectedStatusState.asReadonly();

    private readonly selectedOrderIdState = signal<string | null>(null);

    readonly selectedOrderId = this.selectedOrderIdState.asReadonly();

    setSearchTerm(value: string): void {
        this.searchTermState.set(value);
    }

    setSelectedStatus(status: OrderStatusFilter): void {
        this.selectedStatusState.set(status);
    }

    selectOrder(orderId: string): void {
        this.selectedOrderIdState.set(orderId);
    }

    clearSelectedOrder(): void {
        this.selectedOrderIdState.set(null);
    }
}