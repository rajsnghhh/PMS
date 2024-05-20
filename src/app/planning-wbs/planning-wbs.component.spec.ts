import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningWbsComponent } from './planning-wbs.component';

describe('PlanningWbsComponent', () => {
  let component: PlanningWbsComponent;
  let fixture: ComponentFixture<PlanningWbsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanningWbsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanningWbsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
