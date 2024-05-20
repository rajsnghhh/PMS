import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcurementSiteComponent } from './procurement-site.component';

describe('ProcurementSiteComponent', () => {
  let component: ProcurementSiteComponent;
  let fixture: ComponentFixture<ProcurementSiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcurementSiteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcurementSiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
