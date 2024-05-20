import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetLmpiComponent } from './budget-lmpi.component';

describe('BudgetLmpiComponent', () => {
  let component: BudgetLmpiComponent;
  let fixture: ComponentFixture<BudgetLmpiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BudgetLmpiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetLmpiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
