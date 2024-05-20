import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFortnightComponent } from './view-fortnight.component';

describe('ViewFortnightComponent', () => {
  let component: ViewFortnightComponent;
  let fixture: ComponentFixture<ViewFortnightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewFortnightComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewFortnightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
