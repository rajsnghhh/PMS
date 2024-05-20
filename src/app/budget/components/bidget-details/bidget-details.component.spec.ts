import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BidgetDetailsComponent } from './bidget-details.component';

describe('BidgetDetailsComponent', () => {
  let component: BidgetDetailsComponent;
  let fixture: ComponentFixture<BidgetDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BidgetDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BidgetDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
