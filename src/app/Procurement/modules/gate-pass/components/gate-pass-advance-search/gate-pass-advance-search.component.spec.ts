import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GatePassAdvanceSearchComponent } from './gate-pass-advance-search.component';

describe('GatePassAdvanceSearchComponent', () => {
  let component: GatePassAdvanceSearchComponent;
  let fixture: ComponentFixture<GatePassAdvanceSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GatePassAdvanceSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GatePassAdvanceSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
