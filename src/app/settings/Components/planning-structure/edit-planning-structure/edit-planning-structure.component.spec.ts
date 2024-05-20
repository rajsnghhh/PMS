import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPlanningStructureComponent } from './edit-planning-structure.component';

describe('EditPlanningStructureComponent', () => {
  let component: EditPlanningStructureComponent;
  let fixture: ComponentFixture<EditPlanningStructureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPlanningStructureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPlanningStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
