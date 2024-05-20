import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediclaimEnrollmentViewComponent } from './mediclaim-enrollment-view.component';

describe('MediclaimEnrollmentViewComponent', () => {
  let component: MediclaimEnrollmentViewComponent;
  let fixture: ComponentFixture<MediclaimEnrollmentViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MediclaimEnrollmentViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediclaimEnrollmentViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
