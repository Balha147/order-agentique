
import { inject, Service } from '@angular/core';
import { registerFrontendTool } from '@copilotkit/angular';
import { OrderService } from '../../../features/orders/service/order';
import { OrderUiService } from '../../../features/orders/service/order-ui';
import { createSelectOrderTool } from './select-order.tool';
import { createSetOrderFilterTool } from './set-order-filter.tool';
import { createClearOrderSelectionTool } from './clear-order-selection.tool';
import { createSearchOrdersTool } from './search-orders.tool';
import { createGetOrdersSummaryTool } from './get-orders-summary.tool';


@Service()
export class OrderFrontendToolsService {
    private readonly orderService = inject(OrderService);
    private readonly orderUiService = inject(OrderUiService);

    constructor() {
        registerFrontendTool(
            createSelectOrderTool({
                orderService: this.orderService,
                orderUiService: this.orderUiService,
            }),
        );

        registerFrontendTool(
            createSetOrderFilterTool({
                orderUiService: this.orderUiService,
            }),
        );

        registerFrontendTool(
            createClearOrderSelectionTool({
                orderUiService: this.orderUiService,
            }),
        );

        registerFrontendTool(
            createSearchOrdersTool({
                orderUiService: this.orderUiService,
            }),
        );

        registerFrontendTool(
            createGetOrdersSummaryTool({
                orderService: this.orderService,
            }),
        );
    }
}
