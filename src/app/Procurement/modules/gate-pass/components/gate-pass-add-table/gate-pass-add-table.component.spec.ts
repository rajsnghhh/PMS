import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GatePassAddTableComponent } from './gate-pass-add-table.component';

describe('GatePassAddTableComponent', () => {
  let component: GatePassAddTableComponent;
  let fixture: ComponentFixture<GatePassAddTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GatePassAddTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GatePassAddTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
