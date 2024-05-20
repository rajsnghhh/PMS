import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherLinkingOperationComponent } from './voucher-linking-operation.component';

describe('VoucherLinkingOperationComponent', () => {
  let component: VoucherLinkingOperationComponent;
  let fixture: ComponentFixture<VoucherLinkingOperationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoucherLinkingOperationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoucherLinkingOperationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
