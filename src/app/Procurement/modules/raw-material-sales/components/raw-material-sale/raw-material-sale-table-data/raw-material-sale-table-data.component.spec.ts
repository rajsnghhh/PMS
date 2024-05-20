import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RawMaterialSaleTableDataComponent } from './raw-material-sale-table-data.component';

describe('RawMaterialSaleTableDataComponent', () => {
  let component: RawMaterialSaleTableDataComponent;
  let fixture: ComponentFixture<RawMaterialSaleTableDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RawMaterialSaleTableDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RawMaterialSaleTableDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
