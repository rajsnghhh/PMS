import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateLabTestingComponent } from './add-update-lab-testing.component';

describe('AddUpdateLabTestingComponent', () => {
  let component: AddUpdateLabTestingComponent;
  let fixture: ComponentFixture<AddUpdateLabTestingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateLabTestingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdateLabTestingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
