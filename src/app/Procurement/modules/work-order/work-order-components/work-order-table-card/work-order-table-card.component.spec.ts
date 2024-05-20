import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderTableCardComponent } from './work-order-table-card.component';

describe('WorkOrderTableCardComponent', () => {
  let component: WorkOrderTableCardComponent;
  let fixture: ComponentFixture<WorkOrderTableCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderTableCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderTableCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
