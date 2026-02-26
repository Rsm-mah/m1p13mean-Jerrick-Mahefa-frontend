import { TestBed } from '@angular/core/testing';

import { Oders } from './oders';

describe('Oders', () => {
  let service: Oders;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Oders);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
