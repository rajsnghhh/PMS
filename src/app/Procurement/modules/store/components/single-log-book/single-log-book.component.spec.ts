import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleLogBookComponent } from './single-log-book.component';

describe('SingleLogBookComponent', () => {
  let component: SingleLogBookComponent;
  let fixture: ComponentFixture<SingleLogBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleLogBookComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleLogBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
