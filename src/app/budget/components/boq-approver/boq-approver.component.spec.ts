import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoqApproverComponent } from './boq-approver.component';

describe('BoqApproverComponent', () => {
  let component: BoqApproverComponent;
  let fixture: ComponentFixture<BoqApproverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoqApproverComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoqApproverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
