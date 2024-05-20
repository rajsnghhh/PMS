import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialPhysicalStockComponent } from './material-physical-stock.component';

describe('MaterialPhysicalStockComponent', () => {
  let component: MaterialPhysicalStockComponent;
  let fixture: ComponentFixture<MaterialPhysicalStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialPhysicalStockComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterialPhysicalStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
