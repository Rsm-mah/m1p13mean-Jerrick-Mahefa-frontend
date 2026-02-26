import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicProfil } from './public-profil';

describe('PublicProfil', () => {
  let component: PublicProfil;
  let fixture: ComponentFixture<PublicProfil>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicProfil]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicProfil);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
