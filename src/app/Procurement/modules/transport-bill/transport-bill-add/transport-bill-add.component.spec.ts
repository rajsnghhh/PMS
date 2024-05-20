import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportBillAddComponent } from './transport-bill-add.component';

describe('TransportBillAddComponent', () => {
  let component: TransportBillAddComponent;
  let fixture: ComponentFixture<TransportBillAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransportBillAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransportBillAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
