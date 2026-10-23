import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderProposalForm } from './order-proposal-form';

describe('OrderProposalForm', () => {
  let component: OrderProposalForm;
  let fixture: ComponentFixture<OrderProposalForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderProposalForm],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderProposalForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
