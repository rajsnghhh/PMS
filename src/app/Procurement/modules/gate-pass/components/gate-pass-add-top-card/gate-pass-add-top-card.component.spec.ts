import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GatePassAddTopCardComponent } from './gate-pass-add-top-card.component';

describe('GatePassAddTopCardComponent', () => {
  let component: GatePassAddTopCardComponent;
  let fixture: ComponentFixture<GatePassAddTopCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GatePassAddTopCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GatePassAddTopCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
