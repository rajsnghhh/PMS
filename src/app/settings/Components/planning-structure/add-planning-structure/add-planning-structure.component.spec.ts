import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPlanningStructureComponent } from './add-planning-structure.component';

describe('AddPlanningStructureComponent', () => {
  let component: AddPlanningStructureComponent;
  let fixture: ComponentFixture<AddPlanningStructureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPlanningStructureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPlanningStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
