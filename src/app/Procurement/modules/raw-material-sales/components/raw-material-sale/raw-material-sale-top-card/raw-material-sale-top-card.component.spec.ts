import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RawMaterialSaleTopCardComponent } from './raw-material-sale-top-card.component';

describe('RawMaterialSaleTopCardComponent', () => {
  let component: RawMaterialSaleTopCardComponent;
  let fixture: ComponentFixture<RawMaterialSaleTopCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RawMaterialSaleTopCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RawMaterialSaleTopCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
