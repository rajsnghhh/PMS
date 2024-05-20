import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemwiseVendorComponent } from './itemwise-vendor.component';

describe('ItemwiseVendorComponent', () => {
  let component: ItemwiseVendorComponent;
  let fixture: ComponentFixture<ItemwiseVendorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemwiseVendorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemwiseVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
