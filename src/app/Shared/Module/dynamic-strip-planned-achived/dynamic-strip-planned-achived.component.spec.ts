import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicStripPlannedAchivedComponent } from './dynamic-strip-planned-achived.component';

describe('DynamicStripPlannedAchivedComponent', () => {
  let component: DynamicStripPlannedAchivedComponent;
  let fixture: ComponentFixture<DynamicStripPlannedAchivedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicStripPlannedAchivedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicStripPlannedAchivedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
