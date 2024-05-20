import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LmpiBoqComponent } from './lmpi-boq.component';

describe('LmpiBoqComponent', () => {
  let component: LmpiBoqComponent;
  let fixture: ComponentFixture<LmpiBoqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LmpiBoqComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LmpiBoqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
