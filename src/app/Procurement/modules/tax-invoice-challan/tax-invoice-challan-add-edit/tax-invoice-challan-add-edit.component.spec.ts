import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxInvoiceChallanAddEditComponent } from './tax-invoice-challan-add-edit.component';

describe('TaxInvoiceChallanAddEditComponent', () => {
  let component: TaxInvoiceChallanAddEditComponent;
  let fixture: ComponentFixture<TaxInvoiceChallanAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaxInvoiceChallanAddEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaxInvoiceChallanAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
