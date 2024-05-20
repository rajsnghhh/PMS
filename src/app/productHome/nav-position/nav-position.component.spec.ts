import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavPositionComponent } from './nav-position.component';

describe('NavPositionComponent', () => {
  let component: NavPositionComponent;
  let fixture: ComponentFixture<NavPositionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavPositionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavPositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
