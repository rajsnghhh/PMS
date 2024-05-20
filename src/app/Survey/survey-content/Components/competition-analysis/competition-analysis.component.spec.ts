import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetitionAnalysisComponent } from './competition-analysis.component';

describe('CompetitionAnalysisComponent', () => {
  let component: CompetitionAnalysisComponent;
  let fixture: ComponentFixture<CompetitionAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompetitionAnalysisComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompetitionAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
