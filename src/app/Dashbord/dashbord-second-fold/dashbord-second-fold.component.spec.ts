import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashbordSecondFoldComponent } from './dashbord-second-fold.component';

describe('DashbordSecondFoldComponent', () => {
  let component: DashbordSecondFoldComponent;
  let fixture: ComponentFixture<DashbordSecondFoldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashbordSecondFoldComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashbordSecondFoldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
