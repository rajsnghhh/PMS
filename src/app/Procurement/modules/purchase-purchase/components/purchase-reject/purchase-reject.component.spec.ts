import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseRejectComponent } from './purchase-reject.component';

describe('PurchaseRejectComponent', () => {
  let component: PurchaseRejectComponent;
  let fixture: ComponentFixture<PurchaseRejectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseRejectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseRejectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
