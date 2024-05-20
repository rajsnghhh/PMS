import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateGroupTaskComponent } from './add-update-group-task.component';

describe('AddUpdateGroupTaskComponent', () => {
  let component: AddUpdateGroupTaskComponent;
  let fixture: ComponentFixture<AddUpdateGroupTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateGroupTaskComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdateGroupTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
