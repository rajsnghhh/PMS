import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectTypesIdCategoriesComponent } from './project-types-id-categories.component';

describe('ProjectTypesIdCategoriesComponent', () => {
  let component: ProjectTypesIdCategoriesComponent;
  let fixture: ComponentFixture<ProjectTypesIdCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectTypesIdCategoriesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectTypesIdCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
