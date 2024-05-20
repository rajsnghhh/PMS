import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoTableDataComponent } from './po-table-data.component';

describe('PoTableDataComponent', () => {
  let component: PoTableDataComponent;
  let fixture: ComponentFixture<PoTableDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoTableDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoTableDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
