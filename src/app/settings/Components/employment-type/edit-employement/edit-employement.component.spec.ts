import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEmployementComponent } from './edit-employement.component';

describe('EditEmployementComponent', () => {
  let component: EditEmployementComponent;
  let fixture: ComponentFixture<EditEmployementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditEmployementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditEmployementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
