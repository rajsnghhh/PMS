import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalDocTypeAddEditComponent } from './approval-doc-type-add-edit.component';

describe('ApprovalDocTypeAddEditComponent', () => {
  let component: ApprovalDocTypeAddEditComponent;
  let fixture: ComponentFixture<ApprovalDocTypeAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovalDocTypeAddEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovalDocTypeAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
