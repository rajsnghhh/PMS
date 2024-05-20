import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoGstSecondCardComponent } from './po-gst-second-card.component';

describe('PoGstSecondCardComponent', () => {
  let component: PoGstSecondCardComponent;
  let fixture: ComponentFixture<PoGstSecondCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoGstSecondCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoGstSecondCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
