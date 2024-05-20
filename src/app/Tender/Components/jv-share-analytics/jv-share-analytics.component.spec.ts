import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JvShareAnalyticsComponent } from './jv-share-analytics.component';

describe('JvShareAnalyticsComponent', () => {
  let component: JvShareAnalyticsComponent;
  let fixture: ComponentFixture<JvShareAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JvShareAnalyticsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JvShareAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
