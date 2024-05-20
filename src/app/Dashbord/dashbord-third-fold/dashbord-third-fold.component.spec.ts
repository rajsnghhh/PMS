import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashbordThirdFoldComponent } from './dashbord-third-fold.component';

describe('DashbordThirdFoldComponent', () => {
  let component: DashbordThirdFoldComponent;
  let fixture: ComponentFixture<DashbordThirdFoldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashbordThirdFoldComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashbordThirdFoldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
