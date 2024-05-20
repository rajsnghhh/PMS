import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditCommunicationComponent } from './add-edit-communication.component';

describe('AddEditCommunicationComponent', () => {
  let component: AddEditCommunicationComponent;
  let fixture: ComponentFixture<AddEditCommunicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditCommunicationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditCommunicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
