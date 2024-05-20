import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateIdcComponent } from './add-update-idc.component';

describe('AddUpdateIdcComponent', () => {
  let component: AddUpdateIdcComponent;
  let fixture: ComponentFixture<AddUpdateIdcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateIdcComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdateIdcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
