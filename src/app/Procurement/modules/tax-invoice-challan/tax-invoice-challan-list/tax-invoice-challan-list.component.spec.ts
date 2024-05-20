import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxInvoiceChallanListComponent } from './tax-invoice-challan-list.component';

describe('TaxInvoiceChallanListComponent', () => {
  let component: TaxInvoiceChallanListComponent;
  let fixture: ComponentFixture<TaxInvoiceChallanListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaxInvoiceChallanListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaxInvoiceChallanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
