import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndentAdvancedSearchComponent } from './indent-advanced-search.component';

describe('IndentAdvancedSearchComponent', () => {
  let component: IndentAdvancedSearchComponent;
  let fixture: ComponentFixture<IndentAdvancedSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndentAdvancedSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndentAdvancedSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
