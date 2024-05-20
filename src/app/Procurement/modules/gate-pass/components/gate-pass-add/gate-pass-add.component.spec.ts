import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GatePassAddComponent } from './gate-pass-add.component';

describe('GatePassAddComponent', () => {
  let component: GatePassAddComponent;
  let fixture: ComponentFixture<GatePassAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GatePassAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GatePassAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
