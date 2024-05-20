import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorksAwardedComponent } from './works-awarded.component';

describe('WorksAwardedComponent', () => {
  let component: WorksAwardedComponent;
  let fixture: ComponentFixture<WorksAwardedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorksAwardedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorksAwardedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
