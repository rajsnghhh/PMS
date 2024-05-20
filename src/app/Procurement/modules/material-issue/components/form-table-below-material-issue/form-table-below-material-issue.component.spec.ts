import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTableBelowMaterialIssueComponent } from './form-table-below-material-issue.component';

describe('FormTableBelowMaterialIssueComponent', () => {
  let component: FormTableBelowMaterialIssueComponent;
  let fixture: ComponentFixture<FormTableBelowMaterialIssueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormTableBelowMaterialIssueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormTableBelowMaterialIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
