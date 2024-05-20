import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WayBillAdvancedSearchComponent } from './way-bill-advanced-search.component';

describe('WayBillAdvancedSearchComponent', () => {
  let component: WayBillAdvancedSearchComponent;
  let fixture: ComponentFixture<WayBillAdvancedSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WayBillAdvancedSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WayBillAdvancedSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
