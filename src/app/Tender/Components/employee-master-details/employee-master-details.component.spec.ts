import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeMasterDetailsComponent } from './employee-master-details.component';

describe('EmployeeMasterDetailsComponent', () => {
  let component: EmployeeMasterDetailsComponent;
  let fixture: ComponentFixture<EmployeeMasterDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeMasterDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeMasterDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
