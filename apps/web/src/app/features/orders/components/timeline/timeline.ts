import { Component, inject } from '@angular/core';
import { OrderService } from '../../service/order';

@Component({
  selector: 'app-timeline',
  styleUrl: './timeline.scss',
  templateUrl: './timeline.html',
})
export class Timeline {
  protected readonly orderService = inject(OrderService);
}
