import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPlantMachinaryComponent } from './add-plant-machinary.component';

describe('AddPlantMachinaryComponent', () => {
  let component: AddPlantMachinaryComponent;
  let fixture: ComponentFixture<AddPlantMachinaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPlantMachinaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPlantMachinaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
