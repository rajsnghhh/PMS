import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DasNavComponent } from './das-nav.component';

describe('DasNavComponent', () => {
  let component: DasNavComponent;
  let fixture: ComponentFixture<DasNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DasNavComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DasNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
