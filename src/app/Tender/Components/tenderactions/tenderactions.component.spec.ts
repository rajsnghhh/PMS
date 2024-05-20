import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenderactionsComponent } from './tenderactions.component';

describe('TenderactionsComponent', () => {
  let component: TenderactionsComponent;
  let fixture: ComponentFixture<TenderactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TenderactionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TenderactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
