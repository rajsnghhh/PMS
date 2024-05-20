import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMaterialTypesComponent } from './edit-material-types.component';

describe('EditMaterialTypesComponent', () => {
  let component: EditMaterialTypesComponent;
  let fixture: ComponentFixture<EditMaterialTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditMaterialTypesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditMaterialTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
