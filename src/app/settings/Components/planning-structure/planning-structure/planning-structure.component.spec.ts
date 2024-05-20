import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningStructureComponent } from './planning-structure.component';

describe('PlanningStructureComponent', () => {
  let component: PlanningStructureComponent;
  let fixture: ComponentFixture<PlanningStructureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanningStructureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanningStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
