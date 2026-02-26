import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicLogin } from './public-login';

describe('PublicLogin', () => {
  let component: PublicLogin;
  let fixture: ComponentFixture<PublicLogin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicLogin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicLogin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
