import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcurementQuotationComponent } from './procurement-quotation.component';

describe('ProcurementQuotationComponent', () => {
  let component: ProcurementQuotationComponent;
  let fixture: ComponentFixture<ProcurementQuotationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcurementQuotationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcurementQuotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
