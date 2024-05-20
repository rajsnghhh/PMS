import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterTenderComponent } from './filter-tender.component';

describe('FilterTenderComponent', () => {
  let component: FilterTenderComponent;
  let fixture: ComponentFixture<FilterTenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterTenderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterTenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
