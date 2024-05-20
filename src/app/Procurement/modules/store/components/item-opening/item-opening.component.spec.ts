import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemOpeningComponent } from './item-opening.component';

describe('ItemOpeningComponent', () => {
  let component: ItemOpeningComponent;
  let fixture: ComponentFixture<ItemOpeningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemOpeningComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemOpeningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
