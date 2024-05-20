import { TestBed } from '@angular/core/testing';

import { SecureContentGuard } from './secure-content.guard';

describe('SecureContentGuard', () => {
  let guard: SecureContentGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SecureContentGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
