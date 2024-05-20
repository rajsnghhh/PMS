import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyBillListComponent } from './party-bill-list.component';

describe('PartyBillListComponent', () => {
  let component: PartyBillListComponent;
  let fixture: ComponentFixture<PartyBillListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartyBillListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartyBillListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
