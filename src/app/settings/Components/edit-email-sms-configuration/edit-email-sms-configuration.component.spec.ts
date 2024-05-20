import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEmailSmsConfigurationComponent } from './edit-email-sms-configuration.component';

describe('EditEmailSmsConfigurationComponent', () => {
  let component: EditEmailSmsConfigurationComponent;
  let fixture: ComponentFixture<EditEmailSmsConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditEmailSmsConfigurationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditEmailSmsConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
