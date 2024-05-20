import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateProcurementSiteComponent } from './add-update-procurement-site.component';

describe('AddUpdateProcurementSiteComponent', () => {
  let component: AddUpdateProcurementSiteComponent;
  let fixture: ComponentFixture<AddUpdateProcurementSiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateProcurementSiteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdateProcurementSiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
