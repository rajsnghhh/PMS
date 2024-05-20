import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoGstTopCardComponent } from './po-gst-top-card.component';

describe('PoGstTopCardComponent', () => {
  let component: PoGstTopCardComponent;
  let fixture: ComponentFixture<PoGstTopCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoGstTopCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoGstTopCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
