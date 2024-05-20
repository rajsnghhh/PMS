import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderLastCardComponent } from './work-order-last-card.component';

describe('WorkOrderLastCardComponent', () => {
  let component: WorkOrderLastCardComponent;
  let fixture: ComponentFixture<WorkOrderLastCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderLastCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderLastCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
