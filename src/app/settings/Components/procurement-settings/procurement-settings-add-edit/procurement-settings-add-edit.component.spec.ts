import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcurementSettingsAddEditComponent } from './procurement-settings-add-edit.component';

describe('ProcurementSettingsAddEditComponent', () => {
  let component: ProcurementSettingsAddEditComponent;
  let fixture: ComponentFixture<ProcurementSettingsAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcurementSettingsAddEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcurementSettingsAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
