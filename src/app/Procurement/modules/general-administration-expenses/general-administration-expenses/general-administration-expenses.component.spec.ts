import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralAdministrationExpensesComponent } from './general-administration-expenses.component';

describe('GeneralAdministrationExpensesComponent', () => {
  let component: GeneralAdministrationExpensesComponent;
  let fixture: ComponentFixture<GeneralAdministrationExpensesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralAdministrationExpensesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralAdministrationExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
