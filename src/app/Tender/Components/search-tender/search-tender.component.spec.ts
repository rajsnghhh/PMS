import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchTenderComponent } from './search-tender.component';

describe('SearchTenderComponent', () => {
  let component: SearchTenderComponent;
  let fixture: ComponentFixture<SearchTenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchTenderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchTenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
