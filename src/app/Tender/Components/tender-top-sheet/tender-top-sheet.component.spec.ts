import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenderTopSheetComponent } from './tender-top-sheet.component';

describe('TenderTopSheetComponent', () => {
  let component: TenderTopSheetComponent;
  let fixture: ComponentFixture<TenderTopSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TenderTopSheetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TenderTopSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
