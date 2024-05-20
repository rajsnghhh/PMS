import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationGstTableComponent } from './quotation-gst-table.component';

describe('QuotationGstTableComponent', () => {
  let component: QuotationGstTableComponent;
  let fixture: ComponentFixture<QuotationGstTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotationGstTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuotationGstTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
