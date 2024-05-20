import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RateContractComponent } from './rate-contract.component';

describe('RateContractComponent', () => {
  let component: RateContractComponent;
  let fixture: ComponentFixture<RateContractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RateContractComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RateContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
