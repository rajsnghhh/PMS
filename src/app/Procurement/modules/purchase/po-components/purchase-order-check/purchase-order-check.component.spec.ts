import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrderCheckComponent } from './purchase-order-check.component';

describe('PurchaseOrderCheckComponent', () => {
  let component: PurchaseOrderCheckComponent;
  let fixture: ComponentFixture<PurchaseOrderCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseOrderCheckComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseOrderCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
