import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MergeUnitOfMeasurementComponent } from './merge-unit-of-measurement.component';

describe('MergeUnitOfMeasurementComponent', () => {
  let component: MergeUnitOfMeasurementComponent;
  let fixture: ComponentFixture<MergeUnitOfMeasurementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MergeUnitOfMeasurementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MergeUnitOfMeasurementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
