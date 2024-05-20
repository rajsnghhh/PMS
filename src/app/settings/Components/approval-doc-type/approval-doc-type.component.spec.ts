import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalDocTypeComponent } from './approval-doc-type.component';

describe('ApprovalDocTypeComponent', () => {
  let component: ApprovalDocTypeComponent;
  let fixture: ComponentFixture<ApprovalDocTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovalDocTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovalDocTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
