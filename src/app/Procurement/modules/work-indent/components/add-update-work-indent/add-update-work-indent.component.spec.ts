import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateWorkIndentComponent } from './add-update-work-indent.component';

describe('AddUpdateWorkIndentComponent', () => {
  let component: AddUpdateWorkIndentComponent;
  let fixture: ComponentFixture<AddUpdateWorkIndentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateWorkIndentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdateWorkIndentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
