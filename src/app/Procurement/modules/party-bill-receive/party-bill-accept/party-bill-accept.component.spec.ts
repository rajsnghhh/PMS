import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyBillAcceptComponent } from './party-bill-accept.component';

describe('PartyBillAcceptComponent', () => {
  let component: PartyBillAcceptComponent;
  let fixture: ComponentFixture<PartyBillAcceptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartyBillAcceptComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartyBillAcceptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
