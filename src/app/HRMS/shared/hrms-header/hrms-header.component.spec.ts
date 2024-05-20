import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrmsHeaderComponent } from './hrms-header.component';

describe('HrmsHeaderComponent', () => {
  let component: HrmsHeaderComponent;
  let fixture: ComponentFixture<HrmsHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HrmsHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HrmsHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
