import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateMaterialWastageComponent } from './add-update-material-wastage.component';

describe('AddUpdateMaterialWastageComponent', () => {
  let component: AddUpdateMaterialWastageComponent;
  let fixture: ComponentFixture<AddUpdateMaterialWastageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateMaterialWastageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdateMaterialWastageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
