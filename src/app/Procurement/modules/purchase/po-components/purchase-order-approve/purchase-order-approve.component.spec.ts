import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrderApproveComponent } from './purchase-order-approve.component';

describe('PurchaseOrderApproveComponent', () => {
  let component: PurchaseOrderApproveComponent;
  let fixture: ComponentFixture<PurchaseOrderApproveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseOrderApproveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseOrderApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
