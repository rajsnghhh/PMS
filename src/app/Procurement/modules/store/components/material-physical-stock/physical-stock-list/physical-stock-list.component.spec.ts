import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicalStockListComponent } from './physical-stock-list.component';

describe('PhysicalStockListComponent', () => {
  let component: PhysicalStockListComponent;
  let fixture: ComponentFixture<PhysicalStockListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhysicalStockListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhysicalStockListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
