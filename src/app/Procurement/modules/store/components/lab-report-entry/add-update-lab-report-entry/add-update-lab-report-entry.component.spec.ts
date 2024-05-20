import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateLabReportEntryComponent } from './add-update-lab-report-entry.component';

describe('AddUpdateLabReportEntryComponent', () => {
  let component: AddUpdateLabReportEntryComponent;
  let fixture: ComponentFixture<AddUpdateLabReportEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateLabReportEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdateLabReportEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
