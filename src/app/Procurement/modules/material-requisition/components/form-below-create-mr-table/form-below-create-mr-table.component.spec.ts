import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormBelowCreateMrTableComponent } from './form-below-create-mr-table.component';

describe('FormBelowCreateMrTableComponent', () => {
  let component: FormBelowCreateMrTableComponent;
  let fixture: ComponentFixture<FormBelowCreateMrTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormBelowCreateMrTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormBelowCreateMrTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
