import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoqApprovalComponent } from './boq-approval.component';

describe('BoqApprovalComponent', () => {
  let component: BoqApprovalComponent;
  let fixture: ComponentFixture<BoqApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoqApprovalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoqApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
