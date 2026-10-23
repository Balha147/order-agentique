import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderStats } from './order-stats';

describe('OrderStats', () => {
  let component: OrderStats;
  let fixture: ComponentFixture<OrderStats>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderStats],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderStats);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
