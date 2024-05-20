import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RawMaterialSaleComponent } from './raw-material-sale.component';

describe('RawMaterialSaleComponent', () => {
  let component: RawMaterialSaleComponent;
  let fixture: ComponentFixture<RawMaterialSaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RawMaterialSaleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RawMaterialSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
