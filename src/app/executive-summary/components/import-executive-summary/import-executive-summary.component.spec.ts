import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportExecutiveSummaryComponent } from './import-executive-summary.component';

describe('ImportExecutiveSummaryComponent', () => {
  let component: ImportExecutiveSummaryComponent;
  let fixture: ComponentFixture<ImportExecutiveSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportExecutiveSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportExecutiveSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
