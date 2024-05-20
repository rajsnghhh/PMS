import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WoGstComponent } from './wo-gst.component';

describe('WoGstComponent', () => {
  let component: WoGstComponent;
  let fixture: ComponentFixture<WoGstComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WoGstComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WoGstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
