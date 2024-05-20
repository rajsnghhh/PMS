import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WayBillTableDataComponent } from './way-bill-table-data.component';

describe('WayBillTableDataComponent', () => {
  let component: WayBillTableDataComponent;
  let fixture: ComponentFixture<WayBillTableDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WayBillTableDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WayBillTableDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
