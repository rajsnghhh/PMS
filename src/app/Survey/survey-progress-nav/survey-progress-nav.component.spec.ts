import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyProgressNavComponent } from './survey-progress-nav.component';

describe('SurveyProgressNavComponent', () => {
  let component: SurveyProgressNavComponent;
  let fixture: ComponentFixture<SurveyProgressNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SurveyProgressNavComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurveyProgressNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
