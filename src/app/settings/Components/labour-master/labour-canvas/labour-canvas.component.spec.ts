import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabourCanvasComponent } from './labour-canvas.component';

describe('LabourCanvasComponent', () => {
  let component: LabourCanvasComponent;
  let fixture: ComponentFixture<LabourCanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabourCanvasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabourCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
