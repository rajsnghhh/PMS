import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabReportEntryComponent } from './lab-report-entry.component';

describe('LabReportEntryComponent', () => {
  let component: LabReportEntryComponent;
  let fixture: ComponentFixture<LabReportEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabReportEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabReportEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
