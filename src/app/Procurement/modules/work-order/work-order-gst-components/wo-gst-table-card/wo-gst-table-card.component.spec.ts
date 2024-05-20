import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WoGstTableCardComponent } from './wo-gst-table-card.component';

describe('WoGstTableCardComponent', () => {
  let component: WoGstTableCardComponent;
  let fixture: ComponentFixture<WoGstTableCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WoGstTableCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WoGstTableCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
