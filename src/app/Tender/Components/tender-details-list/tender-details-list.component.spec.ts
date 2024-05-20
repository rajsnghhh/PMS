import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenderDetailsListComponent } from './tender-details-list.component';

describe('TenderDetailsListComponent', () => {
  let component: TenderDetailsListComponent;
  let fixture: ComponentFixture<TenderDetailsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TenderDetailsListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TenderDetailsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
