import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicOrders } from './public-orders';

describe('PublicOrders', () => {
  let component: PublicOrders;
  let fixture: ComponentFixture<PublicOrders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicOrders]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicOrders);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
