import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelayMisComponent } from './delay-mis.component';

describe('DelayMisComponent', () => {
  let component: DelayMisComponent;
  let fixture: ComponentFixture<DelayMisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DelayMisComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DelayMisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
