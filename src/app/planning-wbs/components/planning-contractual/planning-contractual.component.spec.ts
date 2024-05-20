import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningContractualComponent } from './planning-contractual.component';

describe('PlanningContractualComponent', () => {
  let component: PlanningContractualComponent;
  let fixture: ComponentFixture<PlanningContractualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanningContractualComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanningContractualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
