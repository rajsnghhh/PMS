import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkIndentComponent } from './work-indent.component';

describe('WorkIndentComponent', () => {
  let component: WorkIndentComponent;
  let fixture: ComponentFixture<WorkIndentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkIndentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkIndentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
