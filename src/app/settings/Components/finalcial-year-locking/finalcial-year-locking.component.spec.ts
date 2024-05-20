import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalcialYearLockingComponent } from './finalcial-year-locking.component';

describe('FinalcialYearLockingComponent', () => {
  let component: FinalcialYearLockingComponent;
  let fixture: ComponentFixture<FinalcialYearLockingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinalcialYearLockingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinalcialYearLockingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
