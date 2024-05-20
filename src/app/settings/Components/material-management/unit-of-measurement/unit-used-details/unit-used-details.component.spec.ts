import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitUsedDetailsComponent } from './unit-used-details.component';

describe('UnitUsedDetailsComponent', () => {
  let component: UnitUsedDetailsComponent;
  let fixture: ComponentFixture<UnitUsedDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnitUsedDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnitUsedDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
