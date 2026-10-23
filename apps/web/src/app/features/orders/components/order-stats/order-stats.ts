import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { OrderService } from '../../service/order';
import { Order } from '../../models/order.model';
import { OrderStatusFilter, OrderUiService } from '../../service/order-ui';

@Component({
  imports: [CurrencyPipe],
  selector: 'app-order-stats',
  styleUrl: './order-stats.scss',
  templateUrl: './order-stats.html',
})
export class OrderStats {
  private readonly orderService = inject(OrderService);

  private readonly orderUiService = inject(OrderUiService);

  protected readonly stats = computed(() => {
    const orders = this.orderService.orders();

    return {
      total: orders.length,
      pending: orders.filter((order: Order) => order.status === 'pending').length,
      shipped: orders.filter((order: Order) => order.status === 'shipped').length,
      delivered: orders.filter((order: Order) => order.status === 'delivered').length,
      totalValue: orders.reduce((sum: number, order: Order) => sum + order.total, 0),
    };
  });

  protected filterByStatus(status: OrderStatusFilter): void {
    this.orderUiService.setSelectedStatus(status);
  }
}
