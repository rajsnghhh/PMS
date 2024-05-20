import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateItemStockJvComponent } from './add-update-item-stock-jv.component';

describe('AddUpdateItemStockJvComponent', () => {
  let component: AddUpdateItemStockJvComponent;
  let fixture: ComponentFixture<AddUpdateItemStockJvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateItemStockJvComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdateItemStockJvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
