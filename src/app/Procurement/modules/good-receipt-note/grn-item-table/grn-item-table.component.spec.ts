import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrnItemTableComponent } from './grn-item-table.component';

describe('GrnItemTableComponent', () => {
  let component: GrnItemTableComponent;
  let fixture: ComponentFixture<GrnItemTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrnItemTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrnItemTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
