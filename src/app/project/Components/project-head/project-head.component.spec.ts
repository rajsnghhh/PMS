import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectHeadComponent } from './project-head.component';

describe('ProjectHeadComponent', () => {
  let component: ProjectHeadComponent;
  let fixture: ComponentFixture<ProjectHeadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectHeadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
