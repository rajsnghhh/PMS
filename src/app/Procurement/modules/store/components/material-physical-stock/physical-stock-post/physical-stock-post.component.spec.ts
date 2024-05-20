import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicalStockPostComponent } from './physical-stock-post.component';

describe('PhysicalStockPostComponent', () => {
  let component: PhysicalStockPostComponent;
  let fixture: ComponentFixture<PhysicalStockPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhysicalStockPostComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhysicalStockPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
