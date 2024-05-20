import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportBillListComponent } from './transport-bill-list.component';

describe('TransportBillListComponent', () => {
  let component: TransportBillListComponent;
  let fixture: ComponentFixture<TransportBillListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransportBillListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransportBillListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
