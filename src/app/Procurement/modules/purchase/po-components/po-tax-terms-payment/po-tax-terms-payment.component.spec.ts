import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoTaxTermsPaymentComponent } from './po-tax-terms-payment.component';

describe('PoTaxTermsPaymentComponent', () => {
  let component: PoTaxTermsPaymentComponent;
  let fixture: ComponentFixture<PoTaxTermsPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoTaxTermsPaymentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoTaxTermsPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
