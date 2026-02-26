import { TestBed } from '@angular/core/testing';

import { AuthAdmin } from './auth-admin';

describe('AuthAdmin', () => {
  let service: AuthAdmin;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthAdmin);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
