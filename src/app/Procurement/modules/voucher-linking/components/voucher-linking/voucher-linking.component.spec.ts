import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherLinkingComponent } from './voucher-linking.component';

describe('VoucherLinkingComponent', () => {
  let component: VoucherLinkingComponent;
  let fixture: ComponentFixture<VoucherLinkingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoucherLinkingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoucherLinkingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
