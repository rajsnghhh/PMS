import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubletOrderComponent } from './sublet-order.component';

describe('SubletOrderComponent', () => {
  let component: SubletOrderComponent;
  let fixture: ComponentFixture<SubletOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubletOrderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubletOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
