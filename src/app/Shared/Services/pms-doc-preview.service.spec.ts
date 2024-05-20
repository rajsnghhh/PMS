import { TestBed } from '@angular/core/testing';

import { PmsDocPreviewService } from './pms-doc-preview.service';

describe('PmsDocPreviewService', () => {
  let service: PmsDocPreviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PmsDocPreviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
