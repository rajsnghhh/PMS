import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyContentComponent } from './survey-content.component';

describe('SurveyContentComponent', () => {
  let component: SurveyContentComponent;
  let fixture: ComponentFixture<SurveyContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SurveyContentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurveyContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
