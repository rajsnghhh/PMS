import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrnCheckComponent } from './grn-check.component';

describe('GrnCheckComponent', () => {
  let component: GrnCheckComponent;
  let fixture: ComponentFixture<GrnCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrnCheckComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrnCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
