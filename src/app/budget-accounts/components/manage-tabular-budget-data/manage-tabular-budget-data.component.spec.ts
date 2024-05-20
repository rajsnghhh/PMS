import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageTabularBudgetDataComponent } from './manage-tabular-budget-data.component';

describe('ManageTabularBudgetDataComponent', () => {
  let component: ManageTabularBudgetDataComponent;
  let fixture: ComponentFixture<ManageTabularBudgetDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageTabularBudgetDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageTabularBudgetDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
