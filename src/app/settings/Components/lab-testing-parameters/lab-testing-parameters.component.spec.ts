import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabTestingParametersComponent } from './lab-testing-parameters.component';

describe('LabTestingParametersComponent', () => {
  let component: LabTestingParametersComponent;
  let fixture: ComponentFixture<LabTestingParametersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabTestingParametersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabTestingParametersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
