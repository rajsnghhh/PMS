import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WoGstLastCardComponent } from './wo-gst-last-card.component';

describe('WoGstLastCardComponent', () => {
  let component: WoGstLastCardComponent;
  let fixture: ComponentFixture<WoGstLastCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WoGstLastCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WoGstLastCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
