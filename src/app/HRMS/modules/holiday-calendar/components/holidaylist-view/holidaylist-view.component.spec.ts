import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HolidaylistViewComponent } from './holidaylist-view.component';

describe('HolidaylistViewComponent', () => {
  let component: HolidaylistViewComponent;
  let fixture: ComponentFixture<HolidaylistViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HolidaylistViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HolidaylistViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
