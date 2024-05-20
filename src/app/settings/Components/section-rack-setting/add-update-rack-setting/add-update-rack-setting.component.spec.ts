import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateRackSettingComponent } from './add-update-rack-setting.component';

describe('AddUpdateRackSettingComponent', () => {
  let component: AddUpdateRackSettingComponent;
  let fixture: ComponentFixture<AddUpdateRackSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateRackSettingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdateRackSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
