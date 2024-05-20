import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningHeadComponent } from './planning-head.component';

describe('PlanningHeadComponent', () => {
  let component: PlanningHeadComponent;
  let fixture: ComponentFixture<PlanningHeadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanningHeadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanningHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
