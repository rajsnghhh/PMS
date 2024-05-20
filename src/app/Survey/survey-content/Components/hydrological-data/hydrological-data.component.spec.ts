import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HydrologicalDataComponent } from './hydrological-data.component';

describe('HydrologicalDataComponent', () => {
  let component: HydrologicalDataComponent;
  let fixture: ComponentFixture<HydrologicalDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HydrologicalDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HydrologicalDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
