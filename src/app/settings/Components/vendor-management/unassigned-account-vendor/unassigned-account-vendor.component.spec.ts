import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnassignedAccountVendorComponent } from './unassigned-account-vendor.component';

describe('UnassignedAccountVendorComponent', () => {
  let component: UnassignedAccountVendorComponent;
  let fixture: ComponentFixture<UnassignedAccountVendorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnassignedAccountVendorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnassignedAccountVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
