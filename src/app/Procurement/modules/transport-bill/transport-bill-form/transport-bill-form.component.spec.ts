import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportBillFormComponent } from './transport-bill-form.component';

describe('TransportBillFormComponent', () => {
  let component: TransportBillFormComponent;
  let fixture: ComponentFixture<TransportBillFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransportBillFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransportBillFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
