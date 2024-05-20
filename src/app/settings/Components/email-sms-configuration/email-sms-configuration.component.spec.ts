import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailSmsConfigurationComponent } from './email-sms-configuration.component';

describe('EmailSmsConfigurationComponent', () => {
  let component: EmailSmsConfigurationComponent;
  let fixture: ComponentFixture<EmailSmsConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailSmsConfigurationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailSmsConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
