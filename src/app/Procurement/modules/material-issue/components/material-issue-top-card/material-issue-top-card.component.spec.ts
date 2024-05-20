import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialIssueTopCardComponent } from './material-issue-top-card.component';

describe('MaterialIssueTopCardComponent', () => {
  let component: MaterialIssueTopCardComponent;
  let fixture: ComponentFixture<MaterialIssueTopCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialIssueTopCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterialIssueTopCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
