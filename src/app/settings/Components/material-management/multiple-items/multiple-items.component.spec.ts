import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleItemsComponent } from './multiple-items.component';

describe('MultipleItemsComponent', () => {
  let component: MultipleItemsComponent;
  let fixture: ComponentFixture<MultipleItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultipleItemsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultipleItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
