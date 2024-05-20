import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMaterialNaturePropertiesComponent } from './add-material-nature-properties.component';

describe('AddMaterialNaturePropertiesComponent', () => {
  let component: AddMaterialNaturePropertiesComponent;
  let fixture: ComponentFixture<AddMaterialNaturePropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMaterialNaturePropertiesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMaterialNaturePropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
