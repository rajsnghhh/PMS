import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcknowledgementApprovalComponent } from './acknowledgement-approval.component';

describe('AcknowledgementApprovalComponent', () => {
  let component: AcknowledgementApprovalComponent;
  let fixture: ComponentFixture<AcknowledgementApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcknowledgementApprovalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcknowledgementApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
