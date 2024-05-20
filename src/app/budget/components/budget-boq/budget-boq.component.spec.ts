import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetBoqComponent } from './budget-boq.component';

describe('BudgetBoqComponent', () => {
  let component: BudgetBoqComponent;
  let fixture: ComponentFixture<BudgetBoqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BudgetBoqComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetBoqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
