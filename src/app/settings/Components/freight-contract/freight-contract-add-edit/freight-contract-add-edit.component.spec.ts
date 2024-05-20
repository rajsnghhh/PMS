import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreightContractAddEditComponent } from './freight-contract-add-edit.component';

describe('FreightContractAddEditComponent', () => {
  let component: FreightContractAddEditComponent;
  let fixture: ComponentFixture<FreightContractAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FreightContractAddEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FreightContractAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
