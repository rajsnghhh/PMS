import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendSmsEmailIndentComponent } from './send-sms-email-indent.component';

describe('SendSmsEmailIndentComponent', () => {
  let component: SendSmsEmailIndentComponent;
  let fixture: ComponentFixture<SendSmsEmailIndentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendSmsEmailIndentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendSmsEmailIndentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
