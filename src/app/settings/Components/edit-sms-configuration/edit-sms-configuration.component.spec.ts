import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSmsConfigurationComponent } from './edit-sms-configuration.component';

describe('EditSmsConfigurationComponent', () => {
  let component: EditSmsConfigurationComponent;
  let fixture: ComponentFixture<EditSmsConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditSmsConfigurationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSmsConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
