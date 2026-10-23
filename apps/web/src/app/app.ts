
import { Component, inject, signal } from '@angular/core';
import { CopilotChat } from '@copilotkit/angular';
import { Orders } from './features/orders/components/orders/orders';
import { OrderAgentFacade } from './features/orders/service/order-agent.facade';
import { Timeline } from './features/orders/components/timeline/timeline';


@Component({
  selector: 'app-root',
  imports: [CopilotChat, Orders, Timeline],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('web');

  protected readonly orderAgent = inject(OrderAgentFacade);
}
