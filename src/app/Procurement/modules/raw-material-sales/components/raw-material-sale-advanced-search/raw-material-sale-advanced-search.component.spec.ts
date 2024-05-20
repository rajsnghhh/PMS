import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RawMaterialSaleAdvancedSearchComponent } from './raw-material-sale-advanced-search.component';

describe('RawMaterialSaleAdvancedSearchComponent', () => {
  let component: RawMaterialSaleAdvancedSearchComponent;
  let fixture: ComponentFixture<RawMaterialSaleAdvancedSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RawMaterialSaleAdvancedSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RawMaterialSaleAdvancedSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
