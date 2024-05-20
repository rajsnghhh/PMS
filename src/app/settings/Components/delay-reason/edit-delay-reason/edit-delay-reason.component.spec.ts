import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDelayReasonComponent } from './edit-delay-reason.component';

describe('EditDelayReasonComponent', () => {
  let component: EditDelayReasonComponent;
  let fixture: ComponentFixture<EditDelayReasonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditDelayReasonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditDelayReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
