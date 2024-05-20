import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrmsNavPositionComponent } from './hrms-nav-position.component';

describe('HrmsNavPositionComponent', () => {
  let component: HrmsNavPositionComponent;
  let fixture: ComponentFixture<HrmsNavPositionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HrmsNavPositionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HrmsNavPositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
