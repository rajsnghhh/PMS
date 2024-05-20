import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoadWorkComponent } from './road-work.component';

describe('RoadWorkComponent', () => {
  let component: RoadWorkComponent;
  let fixture: ComponentFixture<RoadWorkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoadWorkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoadWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
