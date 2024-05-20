import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoGstComponent } from './po-gst.component';

describe('PoGstComponent', () => {
  let component: PoGstComponent;
  let fixture: ComponentFixture<PoGstComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoGstComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoGstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
