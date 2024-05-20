import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantMachinaryComponent } from './plant-machinary.component';

describe('PlantMachinaryComponent', () => {
  let component: PlantMachinaryComponent;
  let fixture: ComponentFixture<PlantMachinaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlantMachinaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlantMachinaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
