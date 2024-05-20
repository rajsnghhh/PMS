import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCompanySurveyComponent } from './edit-company-survey.component';

describe('EditCompanySurveyComponent', () => {
  let component: EditCompanySurveyComponent;
  let fixture: ComponentFixture<EditCompanySurveyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditCompanySurveyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCompanySurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
