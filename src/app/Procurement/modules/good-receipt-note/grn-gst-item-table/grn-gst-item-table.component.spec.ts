import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrnGstItemTableComponent } from './grn-gst-item-table.component';

describe('GrnGstItemTableComponent', () => {
  let component: GrnGstItemTableComponent;
  let fixture: ComponentFixture<GrnGstItemTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrnGstItemTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrnGstItemTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
