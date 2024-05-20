import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PmsHomeComponent } from './pms-home.component';

describe('PmsHomeComponent', () => {
  let component: PmsHomeComponent;
  let fixture: ComponentFixture<PmsHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PmsHomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PmsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
