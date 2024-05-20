import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditMaterialSubComponent } from './add-edit-material-sub.component';

describe('AddEditMaterialSubComponent', () => {
  let component: AddEditMaterialSubComponent;
  let fixture: ComponentFixture<AddEditMaterialSubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditMaterialSubComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditMaterialSubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
