import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueToTaxInvoiceComponent } from './issue-to-tax-invoice.component';

describe('IssueToTaxInvoiceComponent', () => {
  let component: IssueToTaxInvoiceComponent;
  let fixture: ComponentFixture<IssueToTaxInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IssueToTaxInvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IssueToTaxInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
