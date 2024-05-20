import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeavePreviewComponent } from './leave-preview.component';

describe('LeavePreviewComponent', () => {
  let component: LeavePreviewComponent;
  let fixture: ComponentFixture<LeavePreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeavePreviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeavePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
