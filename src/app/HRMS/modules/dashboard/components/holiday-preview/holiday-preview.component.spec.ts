import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HolidayPreviewComponent } from './holiday-preview.component';

describe('HolidayPreviewComponent', () => {
  let component: HolidayPreviewComponent;
  let fixture: ComponentFixture<HolidayPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HolidayPreviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HolidayPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
