import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WayBillLinkingComponent } from './way-bill-linking.component';

describe('WayBillLinkingComponent', () => {
  let component: WayBillLinkingComponent;
  let fixture: ComponentFixture<WayBillLinkingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WayBillLinkingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WayBillLinkingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
