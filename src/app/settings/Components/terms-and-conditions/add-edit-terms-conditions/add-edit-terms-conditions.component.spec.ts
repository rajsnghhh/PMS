import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditTermsConditionsComponent } from './add-edit-terms-conditions.component';

describe('AddEditTermsConditionsComponent', () => {
  let component: AddEditTermsConditionsComponent;
  let fixture: ComponentFixture<AddEditTermsConditionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditTermsConditionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditTermsConditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
