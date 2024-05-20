import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryActivityBudgetComponent } from './entry-activity-budget.component';

describe('EntryActivityBudgetComponent', () => {
  let component: EntryActivityBudgetComponent;
  let fixture: ComponentFixture<EntryActivityBudgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntryActivityBudgetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntryActivityBudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
