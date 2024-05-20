import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreightContractComponent } from './freight-contract.component';

describe('FreightContractComponent', () => {
  let component: FreightContractComponent;
  let fixture: ComponentFixture<FreightContractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FreightContractComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FreightContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
