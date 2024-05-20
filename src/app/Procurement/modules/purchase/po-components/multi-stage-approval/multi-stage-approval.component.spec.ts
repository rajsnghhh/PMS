import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiStageApprovalComponent } from './multi-stage-approval.component';

describe('MultiStageApprovalComponent', () => {
  let component: MultiStageApprovalComponent;
  let fixture: ComponentFixture<MultiStageApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiStageApprovalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultiStageApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
