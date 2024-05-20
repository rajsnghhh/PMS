import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateLabourComponent } from './add-update-labour.component';

describe('AddUpdateLabourComponent', () => {
  let component: AddUpdateLabourComponent;
  let fixture: ComponentFixture<AddUpdateLabourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateLabourComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdateLabourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
