import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyBillAddeditComponent } from './party-bill-addedit.component';

describe('PartyBillAddeditComponent', () => {
  let component: PartyBillAddeditComponent;
  let fixture: ComponentFixture<PartyBillAddeditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartyBillAddeditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartyBillAddeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
