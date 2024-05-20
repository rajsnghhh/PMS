import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateSingleLogBookComponent } from './add-update-single-log-book.component';

describe('AddUpdateSingleLogBookComponent', () => {
  let component: AddUpdateSingleLogBookComponent;
  let fixture: ComponentFixture<AddUpdateSingleLogBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateSingleLogBookComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdateSingleLogBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
