import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateExpenseMasterComponent } from './add-update-expense-master.component';

describe('AddUpdateExpenseMasterComponent', () => {
  let component: AddUpdateExpenseMasterComponent;
  let fixture: ComponentFixture<AddUpdateExpenseMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateExpenseMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdateExpenseMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
