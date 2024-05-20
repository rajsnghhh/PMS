import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleGrnComponent } from './multiple-grn.component';

describe('MultipleGrnComponent', () => {
  let component: MultipleGrnComponent;
  let fixture: ComponentFixture<MultipleGrnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultipleGrnComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultipleGrnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
