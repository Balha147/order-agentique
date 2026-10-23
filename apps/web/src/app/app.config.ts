import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideCopilotKit } from '@copilotkit/angular';
import { HttpAgent } from '@ag-ui/client';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
registerLocaleData(localeFr, 'fr-FR');

export const API_BASE_URL = 'http://localhost:4555';

export const API_ENDPOINTS = {
  agUi: `${API_BASE_URL}/api/ag-ui`,
  orderProposals: `${API_BASE_URL}/api/orders/proposals`,
} as const;

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideCopilotKit({
      defaultToolRendering: true,
      selfManagedAgents: {
        orderManagementAgent: new HttpAgent({
          url: API_ENDPOINTS.agUi,
        }),
      },
    }),
  ],
};
