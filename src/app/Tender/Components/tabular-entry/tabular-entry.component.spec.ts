import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabularEntryComponent } from './tabular-entry.component';

describe('TabularEntryComponent', () => {
  let component: TabularEntryComponent;
  let fixture: ComponentFixture<TabularEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabularEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabularEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
