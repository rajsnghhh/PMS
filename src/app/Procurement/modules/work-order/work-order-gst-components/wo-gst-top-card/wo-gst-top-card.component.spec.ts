import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WoGstTopCardComponent } from './wo-gst-top-card.component';

describe('WoGstTopCardComponent', () => {
  let component: WoGstTopCardComponent;
  let fixture: ComponentFixture<WoGstTopCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WoGstTopCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WoGstTopCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
