import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEmailSmsConfigurationComponent } from './add-email-sms-configuration.component';

describe('AddEmailSmsConfigurationComponent', () => {
  let component: AddEmailSmsConfigurationComponent;
  let fixture: ComponentFixture<AddEmailSmsConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEmailSmsConfigurationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEmailSmsConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
