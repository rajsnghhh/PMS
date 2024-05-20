import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndentUpdateStatusComponent } from './indent-update-status.component';

describe('IndentUpdateStatusComponent', () => {
  let component: IndentUpdateStatusComponent;
  let fixture: ComponentFixture<IndentUpdateStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndentUpdateStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndentUpdateStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
