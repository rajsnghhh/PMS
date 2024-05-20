import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PneComponent } from './pne.component';

describe('PneComponent', () => {
  let component: PneComponent;
  let fixture: ComponentFixture<PneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
