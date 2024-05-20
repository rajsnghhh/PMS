import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxInvoiceApprovalComponent } from './tax-invoice-approval.component';

describe('TaxInvoiceApprovalComponent', () => {
  let component: TaxInvoiceApprovalComponent;
  let fixture: ComponentFixture<TaxInvoiceApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaxInvoiceApprovalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaxInvoiceApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
