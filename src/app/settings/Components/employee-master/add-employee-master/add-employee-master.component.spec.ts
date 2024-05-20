import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEmployeeMasterComponent } from './add-employee-master.component';

describe('AddEmployeeMasterComponent', () => {
  let component: AddEmployeeMasterComponent;
  let fixture: ComponentFixture<AddEmployeeMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEmployeeMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEmployeeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
