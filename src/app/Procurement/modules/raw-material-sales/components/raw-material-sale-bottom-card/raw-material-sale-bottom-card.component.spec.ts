import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RawMaterialSaleBottomCardComponent } from './raw-material-sale-bottom-card.component';

describe('RawMaterialSaleBottomCardComponent', () => {
  let component: RawMaterialSaleBottomCardComponent;
  let fixture: ComponentFixture<RawMaterialSaleBottomCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RawMaterialSaleBottomCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RawMaterialSaleBottomCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
