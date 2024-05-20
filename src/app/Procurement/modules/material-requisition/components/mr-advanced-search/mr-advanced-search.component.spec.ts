import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MrAdvancedSearchComponent } from './mr-advanced-search.component';

describe('MrAdvancedSearchComponent', () => {
  let component: MrAdvancedSearchComponent;
  let fixture: ComponentFixture<MrAdvancedSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MrAdvancedSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MrAdvancedSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
