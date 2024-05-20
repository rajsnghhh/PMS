import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseTopComponent } from './purchase-top.component';

describe('PurchaseTopComponent', () => {
  let component: PurchaseTopComponent;
  let fixture: ComponentFixture<PurchaseTopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseTopComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseTopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
