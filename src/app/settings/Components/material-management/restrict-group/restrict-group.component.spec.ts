import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestrictGroupComponent } from './restrict-group.component';

describe('RestrictGroupComponent', () => {
  let component: RestrictGroupComponent;
  let fixture: ComponentFixture<RestrictGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RestrictGroupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestrictGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
