import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyAdvanceLeaveComponent } from './apply-advance-leave.component';

describe('ApplyAdvanceLeaveComponent', () => {
  let component: ApplyAdvanceLeaveComponent;
  let fixture: ComponentFixture<ApplyAdvanceLeaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplyAdvanceLeaveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplyAdvanceLeaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
