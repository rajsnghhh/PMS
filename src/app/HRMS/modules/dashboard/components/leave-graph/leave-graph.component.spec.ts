import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveGraphComponent } from './leave-graph.component';

describe('LeaveGraphComponent', () => {
  let component: LeaveGraphComponent;
  let fixture: ComponentFixture<LeaveGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaveGraphComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
