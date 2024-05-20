import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueAdvancedSearchComponent } from './issue-advanced-search.component';

describe('IssueAdvancedSearchComponent', () => {
  let component: IssueAdvancedSearchComponent;
  let fixture: ComponentFixture<IssueAdvancedSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IssueAdvancedSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IssueAdvancedSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
