import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseBelowTableComponent } from './purchase-below-table.component';

describe('PurchaseBelowTableComponent', () => {
  let component: PurchaseBelowTableComponent;
  let fixture: ComponentFixture<PurchaseBelowTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseBelowTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseBelowTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
