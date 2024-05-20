import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RawMaterialSaleTaxComponent } from './raw-material-sale-tax.component';

describe('RawMaterialSaleTaxComponent', () => {
  let component: RawMaterialSaleTaxComponent;
  let fixture: ComponentFixture<RawMaterialSaleTaxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RawMaterialSaleTaxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RawMaterialSaleTaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
