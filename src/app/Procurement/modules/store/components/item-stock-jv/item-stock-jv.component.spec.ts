import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemStockJvComponent } from './item-stock-jv.component';

describe('ItemStockJvComponent', () => {
  let component: ItemStockJvComponent;
  let fixture: ComponentFixture<ItemStockJvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemStockJvComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemStockJvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
