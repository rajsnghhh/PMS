import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrderAdvanceSearchComponent } from './purchase-order-advance-search.component';

describe('PurchaseOrderAdvanceSearchComponent', () => {
  let component: PurchaseOrderAdvanceSearchComponent;
  let fixture: ComponentFixture<PurchaseOrderAdvanceSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseOrderAdvanceSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseOrderAdvanceSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
