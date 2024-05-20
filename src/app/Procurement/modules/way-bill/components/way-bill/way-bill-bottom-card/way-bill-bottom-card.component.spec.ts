import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WayBillBottomCardComponent } from './way-bill-bottom-card.component';

describe('WayBillBottomCardComponent', () => {
  let component: WayBillBottomCardComponent;
  let fixture: ComponentFixture<WayBillBottomCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WayBillBottomCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WayBillBottomCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
