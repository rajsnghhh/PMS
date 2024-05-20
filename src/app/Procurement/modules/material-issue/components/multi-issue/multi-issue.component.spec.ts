import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiIssueComponent } from './multi-issue.component';

describe('MultiIssueComponent', () => {
  let component: MultiIssueComponent;
  let fixture: ComponentFixture<MultiIssueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiIssueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultiIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
