import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WayBillTopCardComponent } from './way-bill-top-card.component';

describe('WayBillTopCardComponent', () => {
  let component: WayBillTopCardComponent;
  let fixture: ComponentFixture<WayBillTopCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WayBillTopCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WayBillTopCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
