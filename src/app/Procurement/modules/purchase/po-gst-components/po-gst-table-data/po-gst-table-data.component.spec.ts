import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoGstTableDataComponent } from './po-gst-table-data.component';

describe('PoGstTableDataComponent', () => {
  let component: PoGstTableDataComponent;
  let fixture: ComponentFixture<PoGstTableDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoGstTableDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoGstTableDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
