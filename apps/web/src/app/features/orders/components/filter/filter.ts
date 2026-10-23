import { Component, inject } from '@angular/core';
import { OrderUiService } from '../../service/order-ui';

@Component({
  selector: 'app-filter',
  styleUrl: './filter.scss',
  templateUrl: './filter.html',
})
export class Filter {
  protected readonly orderUiService = inject(OrderUiService);

  protected readonly statusOptions = [
    { value: 'all', label: 'Toutes les commandes' },
    { value: 'pending', label: 'En attente' },
    { value: 'shipped', label: 'Expédiées' },
    { value: 'delivered', label: 'Livrées' },
  ] as const;

  protected onSearchInput(event: Event): void {
    const target = event.target;

    if (target instanceof HTMLInputElement) {
      this.orderUiService.setSearchTerm(target.value);
    }
  }

  protected onStatusSelect(event: Event): void {
    const target = event.target;

    if (!(target instanceof HTMLSelectElement)) {
      return;
    }

    const status = target.value;

    if (
      status === 'all' ||
      status === 'pending' ||
      status === 'shipped' ||
      status === 'delivered'
    ) {
      this.orderUiService.setSelectedStatus(status);
    }
  }
}
