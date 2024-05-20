import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationTopCardComponent } from './quotation-top-card.component';

describe('QuotationTopCardComponent', () => {
  let component: QuotationTopCardComponent;
  let fixture: ComponentFixture<QuotationTopCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotationTopCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuotationTopCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
