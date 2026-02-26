import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicOrdersDetail } from './public-orders-detail';

describe('PublicOrdersDetail', () => {
  let component: PublicOrdersDetail;
  let fixture: ComponentFixture<PublicOrdersDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicOrdersDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicOrdersDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
