import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateTransportRateComponent } from './add-update-transport-rate.component';

describe('AddUpdateTransportRateComponent', () => {
  let component: AddUpdateTransportRateComponent;
  let fixture: ComponentFixture<AddUpdateTransportRateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateTransportRateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdateTransportRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
