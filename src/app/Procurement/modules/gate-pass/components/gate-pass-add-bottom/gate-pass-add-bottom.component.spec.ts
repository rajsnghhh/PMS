import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GatePassAddBottomComponent } from './gate-pass-add-bottom.component';

describe('GatePassAddBottomComponent', () => {
  let component: GatePassAddBottomComponent;
  let fixture: ComponentFixture<GatePassAddBottomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GatePassAddBottomComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GatePassAddBottomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
