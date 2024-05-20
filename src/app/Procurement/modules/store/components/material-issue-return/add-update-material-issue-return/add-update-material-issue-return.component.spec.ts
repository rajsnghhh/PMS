import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateMaterialIssueReturnComponent } from './add-update-material-issue-return.component';

describe('AddUpdateMaterialIssueReturnComponent', () => {
  let component: AddUpdateMaterialIssueReturnComponent;
  let fixture: ComponentFixture<AddUpdateMaterialIssueReturnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateMaterialIssueReturnComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdateMaterialIssueReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
