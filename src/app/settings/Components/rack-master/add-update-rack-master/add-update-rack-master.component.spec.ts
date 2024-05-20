import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateRackMasterComponent } from './add-update-rack-master.component';

describe('AddUpdateRackMasterComponent', () => {
  let component: AddUpdateRackMasterComponent;
  let fixture: ComponentFixture<AddUpdateRackMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateRackMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdateRackMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
