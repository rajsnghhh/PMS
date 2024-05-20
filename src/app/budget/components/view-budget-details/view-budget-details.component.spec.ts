import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBudgetDetailsComponent } from './view-budget-details.component';

describe('ViewBudgetDetailsComponent', () => {
  let component: ViewBudgetDetailsComponent;
  let fixture: ComponentFixture<ViewBudgetDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewBudgetDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewBudgetDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
