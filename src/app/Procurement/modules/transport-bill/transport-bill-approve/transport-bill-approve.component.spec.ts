import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportBillApproveComponent } from './transport-bill-approve.component';

describe('TransportBillApproveComponent', () => {
  let component: TransportBillApproveComponent;
  let fixture: ComponentFixture<TransportBillApproveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransportBillApproveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransportBillApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
