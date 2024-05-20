import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashbordFirstFoldComponent } from './dashbord-first-fold.component';

describe('DashbordFirstFoldComponent', () => {
  let component: DashbordFirstFoldComponent;
  let fixture: ComponentFixture<DashbordFirstFoldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashbordFirstFoldComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashbordFirstFoldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
