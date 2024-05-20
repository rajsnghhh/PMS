import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrnAdvanceSearchComponent } from './grn-advance-search.component';

describe('GrnAdvanceSearchComponent', () => {
  let component: GrnAdvanceSearchComponent;
  let fixture: ComponentFixture<GrnAdvanceSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrnAdvanceSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrnAdvanceSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
