import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUnitOfMeasurementComponent } from './edit-unit-of-measurement.component';

describe('EditUnitOfMeasurementComponent', () => {
  let component: EditUnitOfMeasurementComponent;
  let fixture: ComponentFixture<EditUnitOfMeasurementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditUnitOfMeasurementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditUnitOfMeasurementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
