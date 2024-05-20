import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RateContractAddEditComponent } from './rate-contract-add-edit.component';

describe('RateContractAddEditComponent', () => {
  let component: RateContractAddEditComponent;
  let fixture: ComponentFixture<RateContractAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RateContractAddEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RateContractAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
