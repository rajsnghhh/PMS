import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationTaxTableComponent } from './quotation-tax-table.component';

describe('QuotationTaxTableComponent', () => {
  let component: QuotationTaxTableComponent;
  let fixture: ComponentFixture<QuotationTaxTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotationTaxTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuotationTaxTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
