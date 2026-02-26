import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicProducts } from './public-products';

describe('PublicProducts', () => {
  let component: PublicProducts;
  let fixture: ComponentFixture<PublicProducts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicProducts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicProducts);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
