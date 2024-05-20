import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityBudgetComponent } from './activity-budget.component';

describe('ActivityBudgetComponent', () => {
  let component: ActivityBudgetComponent;
  let fixture: ComponentFixture<ActivityBudgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivityBudgetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivityBudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
