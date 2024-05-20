import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseGstTableComponent } from './purchase-gst-table.component';

describe('PurchaseGstTableComponent', () => {
  let component: PurchaseGstTableComponent;
  let fixture: ComponentFixture<PurchaseGstTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseGstTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseGstTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
