import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTabularBudgetDataComponent } from './add-tabular-budget-data.component';

describe('AddTabularBudgetDataComponent', () => {
  let component: AddTabularBudgetDataComponent;
  let fixture: ComponentFixture<AddTabularBudgetDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTabularBudgetDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTabularBudgetDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
