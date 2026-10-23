import { Component, computed, inject } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';

import { OrderUiService } from '../../service/order-ui';
import type {
  ConfirmOrderProposalEvent,
  Order,
  OrderStatus,
} from '../../models/order.model';
import { OrderService } from '../../service/order';
import { Filter } from '../filter/filter';
import { OrderStats } from '../order-stats/order-stats';
import { OrderAgentFacade } from '../../service/order-agent.facade';
import { OrderProposalForm } from '../order-proposal-form/order-proposal-form';

@Component({
  imports: [CurrencyPipe, Filter, DatePipe, OrderStats, OrderProposalForm],
  selector: 'app-orders',
  styleUrl: './orders.scss',
  templateUrl: './orders.html',
})
export class Orders {
  protected readonly orderService = inject(OrderService);
  protected readonly orderUiService = inject(OrderUiService);

  protected readonly orderAgent = inject(OrderAgentFacade);

  protected readonly filteredOrders = computed(() => {
    const orders = this.orderService.orders();
    const searchTerm = this.orderUiService.searchTerm().trim().toLowerCase();
    const selectedStatus = this.orderUiService.selectedStatus();

    return orders.filter((order: Order) => {
      const matchesSearch =
        !searchTerm ||
        order.id.toLowerCase().includes(searchTerm) ||
        order.customer.toLowerCase().includes(searchTerm);

      const matchesStatus =
        selectedStatus === 'all' ||
        order.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  });

  protected readonly selectedOrder = computed(() => {
    const selectedId = this.orderUiService.selectedOrderId();

    if (!selectedId) {
      return null;
    }

    return (
      this.orderService.orders().find((order: Order) => order.id === selectedId) ??
      null
    );
  });

  protected readonly statusLabels: Record<OrderStatus, string> = {
    pending: 'En attente',
    shipped: 'Expédiée',
    delivered: 'Livrée',
  };

  protected readonly nextStatusLabels: Partial<
    Record<OrderStatus, string>
  > = {
      pending: 'Marquer comme expédiée',
      shipped: 'Marquer comme livrée',
    };

  protected selectOrder(orderId: string): void {
    this.orderUiService.selectOrder(orderId);
  }

  protected clearSelection(): void {
    this.orderUiService.clearSelectedOrder();
  }


  protected async onConfirmProposal(
    event: ConfirmOrderProposalEvent,
  ): Promise<void> {
    try {
      await this.orderService.confirmOrderProposal(
        event.proposalId,
        event.order,
      );
    } catch (error) {
      console.error('[Orders] Confirmation échouée :', error);
    }
  }

  protected async onCancelProposal(
    proposalId: string,
  ): Promise<void> {
    try {
      await this.orderService.cancelOrderProposal(proposalId);
    } catch (error) {
      console.error('[Orders] Annulation échouée :', error);
    }
  }

  // protected async advanceStatus(order: Order): Promise<void> {
  //   const nextStatus: Partial<Record<OrderStatus, OrderStatus>> = {
  //     pending: 'shipped',
  //     shipped: 'delivered',
  //   };

  //   const status = nextStatus[order.status];

  //   if (!status) {
  //     return;
  //   }

  //   try {
  //     await this.orderService.updateStatus(order.id, status);
  //   } catch (error: any) {
  //     const message =
  //       error instanceof HttpErrorResponse
  //         ? error.status === 409
  //           ? 'Cette transition de statut n’est pas autorisée.'
  //           : error.status === 404
  //             ? 'Cette commande n’existe plus.'
  //             : 'Impossible de mettre à jour la commande.'
  //         : 'Une erreur inattendue est survenue.';

  //     this.orderService.setError(message);
  //   }
  // }
}