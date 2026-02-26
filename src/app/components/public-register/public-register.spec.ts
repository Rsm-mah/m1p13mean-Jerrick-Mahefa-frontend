import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicRegister } from './public-register';

describe('PublicRegister', () => {
  let component: PublicRegister;
  let fixture: ComponentFixture<PublicRegister>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicRegister]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicRegister);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
