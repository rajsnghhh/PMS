import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMaterialNaturePropertiesComponent } from './edit-material-nature-properties.component';

describe('EditMaterialNaturePropertiesComponent', () => {
  let component: EditMaterialNaturePropertiesComponent;
  let fixture: ComponentFixture<EditMaterialNaturePropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditMaterialNaturePropertiesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditMaterialNaturePropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
