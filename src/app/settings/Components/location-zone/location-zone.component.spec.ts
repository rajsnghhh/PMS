import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationZoneComponent } from './location-zone.component';

describe('LocationZoneComponent', () => {
  let component: LocationZoneComponent;
  let fixture: ComponentFixture<LocationZoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocationZoneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocationZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
