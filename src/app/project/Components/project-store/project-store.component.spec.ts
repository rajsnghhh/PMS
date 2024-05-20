import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectStoreComponent } from './project-store.component';

describe('ProjectStoreComponent', () => {
  let component: ProjectStoreComponent;
  let fixture: ComponentFixture<ProjectStoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectStoreComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
