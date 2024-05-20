import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdEditTaxComponent } from './ad-edit-tax.component';

describe('AdEditTaxComponent', () => {
  let component: AdEditTaxComponent;
  let fixture: ComponentFixture<AdEditTaxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdEditTaxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdEditTaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
