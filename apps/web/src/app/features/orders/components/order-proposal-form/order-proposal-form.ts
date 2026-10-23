import { Component, effect, input, output, signal } from '@angular/core';
import { ConfirmOrderProposalEvent, OrderProposal, OrderProposalFormModel } from '../../models/order.model';
import { form, FormField, submit } from '@angular/forms/signals';
import { orderProposalSchema } from './order-proposal-form..schema';

@Component({
  imports: [FormField],
  selector: 'app-order-proposal-form',
  styleUrl: './order-proposal-form.scss',
  templateUrl: './order-proposal-form.html',
})
export class OrderProposalForm {
  readonly proposal = input.required<OrderProposal>();
  readonly submitting = input(false);

  readonly confirmProposal = output<ConfirmOrderProposalEvent>();
  readonly cancelProposal = output<string>();

  readonly model = signal<OrderProposalFormModel>({
    customer: '',
    itemsText: '',
    total: 0,
  });

  readonly orderForm = form(this.model, orderProposalSchema);

  constructor() {
    effect(() => {
      const proposal = this.proposal();
      this.model.set({
        customer: proposal.order.customer,
        itemsText: proposal.order.items.join('\n'),
        total: proposal.order.total,
      });
    });
  }

  onFormSubmit(event: SubmitEvent): void {
    event.preventDefault();
    submit(this.orderForm, async () => {
      if (this.submitting()) {
        return;
      }
      const values = this.model();
      const items = values.itemsText
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean);

      if (items.length === 0) {
        return;
      }
      this.confirmProposal.emit({
        proposalId: this.proposal().proposalId,
        order: {
          customer: values.customer.trim(),
          items,
          total: values.total,
        },
      });
    });
  }

  cancel(): void {
    if (!this.submitting()) {
      this.cancelProposal.emit(this.proposal().proposalId);
    }
  }
}
