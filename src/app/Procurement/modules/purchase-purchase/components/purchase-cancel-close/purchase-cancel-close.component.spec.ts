import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseCancelCloseComponent } from './purchase-cancel-close.component';

describe('PurchaseCancelCloseComponent', () => {
  let component: PurchaseCancelCloseComponent;
  let fixture: ComponentFixture<PurchaseCancelCloseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseCancelCloseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseCancelCloseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
