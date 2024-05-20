import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateGeneralAdministrationExpensesComponent } from './add-update-general-administration-expenses.component';

describe('AddUpdateGeneralAdministrationExpensesComponent', () => {
  let component: AddUpdateGeneralAdministrationExpensesComponent;
  let fixture: ComponentFixture<AddUpdateGeneralAdministrationExpensesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateGeneralAdministrationExpensesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdateGeneralAdministrationExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
