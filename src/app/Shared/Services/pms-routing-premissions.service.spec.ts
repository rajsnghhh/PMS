import { TestBed } from '@angular/core/testing';

import { PmsRoutingPremissionsService } from './pms-routing-premissions.service';

describe('PmsRoutingPremissionsService', () => {
  let service: PmsRoutingPremissionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PmsRoutingPremissionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
