import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseCheckComponent } from './purchase-check.component';

describe('PurchaseCheckComponent', () => {
  let component: PurchaseCheckComponent;
  let fixture: ComponentFixture<PurchaseCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseCheckComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
