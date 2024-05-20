import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndentPrintComponent } from './indent-print.component';

describe('IndentPrintComponent', () => {
  let component: IndentPrintComponent;
  let fixture: ComponentFixture<IndentPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndentPrintComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndentPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
