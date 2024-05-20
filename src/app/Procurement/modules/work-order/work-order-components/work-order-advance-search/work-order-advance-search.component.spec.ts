import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderAdvanceSearchComponent } from './work-order-advance-search.component';

describe('WorkOrderAdvanceSearchComponent', () => {
  let component: WorkOrderAdvanceSearchComponent;
  let fixture: ComponentFixture<WorkOrderAdvanceSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderAdvanceSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderAdvanceSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
