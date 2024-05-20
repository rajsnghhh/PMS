import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RawMaterialSaleListComponent } from './raw-material-sale-list.component';

describe('RawMaterialSaleListComponent', () => {
  let component: RawMaterialSaleListComponent;
  let fixture: ComponentFixture<RawMaterialSaleListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RawMaterialSaleListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RawMaterialSaleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
