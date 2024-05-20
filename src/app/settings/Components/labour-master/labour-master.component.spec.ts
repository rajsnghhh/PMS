import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabourMasterComponent } from './labour-master.component';

describe('LabourMasterComponent', () => {
  let component: LabourMasterComponent;
  let fixture: ComponentFixture<LabourMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabourMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabourMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
