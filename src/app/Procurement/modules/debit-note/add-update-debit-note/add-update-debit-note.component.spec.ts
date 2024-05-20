import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateDebitNoteComponent } from './add-update-debit-note.component';

describe('AddUpdateDebitNoteComponent', () => {
  let component: AddUpdateDebitNoteComponent;
  let fixture: ComponentFixture<AddUpdateDebitNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateDebitNoteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdateDebitNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
