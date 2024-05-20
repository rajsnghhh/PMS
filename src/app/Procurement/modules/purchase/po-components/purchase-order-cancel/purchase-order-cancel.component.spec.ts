import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrderCancelComponent } from './purchase-order-cancel.component';

describe('PurchaseOrderCancelComponent', () => {
  let component: PurchaseOrderCancelComponent;
  let fixture: ComponentFixture<PurchaseOrderCancelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseOrderCancelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseOrderCancelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
