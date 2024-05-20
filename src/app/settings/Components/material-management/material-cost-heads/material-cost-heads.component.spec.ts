import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialCostHeadsComponent } from './material-cost-heads.component';

describe('MaterialCostHeadsComponent', () => {
  let component: MaterialCostHeadsComponent;
  let fixture: ComponentFixture<MaterialCostHeadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialCostHeadsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterialCostHeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
