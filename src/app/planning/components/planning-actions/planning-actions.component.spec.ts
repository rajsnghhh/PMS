import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningActionsComponent } from './planning-actions.component';

describe('PlanningActionsComponent', () => {
  let component: PlanningActionsComponent;
  let fixture: ComponentFixture<PlanningActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanningActionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanningActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
