import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialReqPlanComponent } from './material-req-plan.component';

describe('MaterialReqPlanComponent', () => {
  let component: MaterialReqPlanComponent;
  let fixture: ComponentFixture<MaterialReqPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialReqPlanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterialReqPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
