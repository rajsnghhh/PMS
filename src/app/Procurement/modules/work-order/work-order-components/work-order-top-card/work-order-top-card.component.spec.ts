import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderTopCardComponent } from './work-order-top-card.component';

describe('WorkOrderTopCardComponent', () => {
  let component: WorkOrderTopCardComponent;
  let fixture: ComponentFixture<WorkOrderTopCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderTopCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderTopCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
