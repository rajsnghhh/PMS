import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoGstThirdCardComponent } from './po-gst-third-card.component';

describe('PoGstThirdCardComponent', () => {
  let component: PoGstThirdCardComponent;
  let fixture: ComponentFixture<PoGstThirdCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoGstThirdCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoGstThirdCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
