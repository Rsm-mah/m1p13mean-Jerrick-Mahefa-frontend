import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicCart } from './public-cart';

describe('PublicCart', () => {
  let component: PublicCart;
  let fixture: ComponentFixture<PublicCart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicCart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicCart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
