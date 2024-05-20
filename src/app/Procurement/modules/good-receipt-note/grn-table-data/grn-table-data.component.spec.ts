import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrnTableDataComponent } from './grn-table-data.component';

describe('GrnTableDataComponent', () => {
  let component: GrnTableDataComponent;
  let fixture: ComponentFixture<GrnTableDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrnTableDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrnTableDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
