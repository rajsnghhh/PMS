import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndentTopCardComponent } from './indent-top-card.component';

describe('IndentTopCardComponent', () => {
  let component: IndentTopCardComponent;
  let fixture: ComponentFixture<IndentTopCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndentTopCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndentTopCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
