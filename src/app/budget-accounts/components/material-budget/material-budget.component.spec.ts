import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialBudgetComponent } from './material-budget.component';

describe('MaterialBudgetComponent', () => {
  let component: MaterialBudgetComponent;
  let fixture: ComponentFixture<MaterialBudgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialBudgetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterialBudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
