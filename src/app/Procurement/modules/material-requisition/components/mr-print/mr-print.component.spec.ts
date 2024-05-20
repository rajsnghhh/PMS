import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MRPrintComponent } from './mr-print.component';

describe('MRPrintComponent', () => {
  let component: MRPrintComponent;
  let fixture: ComponentFixture<MRPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MRPrintComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MRPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
