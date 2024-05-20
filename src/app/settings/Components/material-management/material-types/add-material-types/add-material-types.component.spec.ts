import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMaterialTypesComponent } from './add-material-types.component';

describe('AddMaterialTypesComponent', () => {
  let component: AddMaterialTypesComponent;
  let fixture: ComponentFixture<AddMaterialTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMaterialTypesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMaterialTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
