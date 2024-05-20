import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDelayReasonComponent } from './add-delay-reason.component';

describe('AddDelayReasonComponent', () => {
  let component: AddDelayReasonComponent;
  let fixture: ComponentFixture<AddDelayReasonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDelayReasonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDelayReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
