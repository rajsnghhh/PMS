import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUserEventComponent } from './edit-user-event.component';

describe('EditUserEventComponent', () => {
  let component: EditUserEventComponent;
  let fixture: ComponentFixture<EditUserEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditUserEventComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditUserEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
