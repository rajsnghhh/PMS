import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClosingStockTRNComponent } from './closing-stock-trn.component';

describe('ClosingStockTRNComponent', () => {
  let component: ClosingStockTRNComponent;
  let fixture: ComponentFixture<ClosingStockTRNComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClosingStockTRNComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClosingStockTRNComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
