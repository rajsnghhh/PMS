import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownWiseBudgetComponent } from './dropdown-wise-budget.component';

describe('DropdownWiseBudgetComponent', () => {
  let component: DropdownWiseBudgetComponent;
  let fixture: ComponentFixture<DropdownWiseBudgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DropdownWiseBudgetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DropdownWiseBudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
