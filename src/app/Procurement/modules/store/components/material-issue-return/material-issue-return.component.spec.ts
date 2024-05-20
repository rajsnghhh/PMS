import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialIssueReturnComponent } from './material-issue-return.component';

describe('MaterialIssueReturnComponent', () => {
  let component: MaterialIssueReturnComponent;
  let fixture: ComponentFixture<MaterialIssueReturnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialIssueReturnComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterialIssueReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
