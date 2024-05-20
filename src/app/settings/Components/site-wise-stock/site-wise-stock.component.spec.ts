import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteWiseStockComponent } from './site-wise-stock.component';

describe('SiteWiseStockComponent', () => {
  let component: SiteWiseStockComponent;
  let fixture: ComponentFixture<SiteWiseStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SiteWiseStockComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SiteWiseStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
