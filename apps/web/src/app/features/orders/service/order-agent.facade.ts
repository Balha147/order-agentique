
import { inject, Service } from '@angular/core';
import { OrderFrontendToolsService } from '../../../core/agent/tools/order-frontend-tools';
import { OrderService } from './order';
import { OrderAgentEventsService } from '../../../core/agent/order-agent-events';


@Service()
export class OrderAgentFacade {
    private readonly orderService = inject(OrderService);

    readonly agentTimeline = this.orderService.agentTimeline.asReadonly();
    readonly agentRunning = this.orderService.agentRunning.asReadonly();
    readonly agentProgress = this.orderService.agentProgress.asReadonly();

    constructor() {
        inject(OrderFrontendToolsService);
        inject(OrderAgentEventsService);
    }
}
