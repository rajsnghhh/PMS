import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSmsConfigurationComponent } from './add-sms-configuration.component';

describe('AddSmsConfigurationComponent', () => {
  let component: AddSmsConfigurationComponent;
  let fixture: ComponentFixture<AddSmsConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSmsConfigurationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSmsConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
