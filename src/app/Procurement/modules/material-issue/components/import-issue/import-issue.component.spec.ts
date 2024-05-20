import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportIssueComponent } from './import-issue.component';

describe('ImportIssueComponent', () => {
  let component: ImportIssueComponent;
  let fixture: ComponentFixture<ImportIssueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportIssueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
