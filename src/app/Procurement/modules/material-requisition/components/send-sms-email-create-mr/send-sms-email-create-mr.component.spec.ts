import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendSmsEmailCreateMrComponent } from './send-sms-email-create-mr.component';

describe('SendSmsEmailCreateMrComponent', () => {
  let component: SendSmsEmailCreateMrComponent;
  let fixture: ComponentFixture<SendSmsEmailCreateMrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendSmsEmailCreateMrComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendSmsEmailCreateMrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
