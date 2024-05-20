import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDataBelowMaterialIssueComponent } from './form-data-below-material-issue.component';

describe('FormDataBelowMaterialIssueComponent', () => {
  let component: FormDataBelowMaterialIssueComponent;
  let fixture: ComponentFixture<FormDataBelowMaterialIssueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormDataBelowMaterialIssueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormDataBelowMaterialIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
