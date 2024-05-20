import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckIndentComponent } from './check-indent.component';

describe('CheckIndentComponent', () => {
  let component: CheckIndentComponent;
  let fixture: ComponentFixture<CheckIndentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckIndentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckIndentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
