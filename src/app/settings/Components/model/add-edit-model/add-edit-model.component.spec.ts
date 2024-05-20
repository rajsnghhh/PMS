import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditModelComponent } from './add-edit-model.component';

describe('AddEditModelComponent', () => {
  let component: AddEditModelComponent;
  let fixture: ComponentFixture<AddEditModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditModelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
