import { TestBed } from '@angular/core/testing';

import { AccessUrlService } from './access-url.service';

describe('AccessUrlService', () => {
  let service: AccessUrlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccessUrlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
