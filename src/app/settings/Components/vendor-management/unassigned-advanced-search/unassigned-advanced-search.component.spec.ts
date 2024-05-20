import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnassignedAdvancedSearchComponent } from './unassigned-advanced-search.component';

describe('UnassignedAdvancedSearchComponent', () => {
  let component: UnassignedAdvancedSearchComponent;
  let fixture: ComponentFixture<UnassignedAdvancedSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnassignedAdvancedSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnassignedAdvancedSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
