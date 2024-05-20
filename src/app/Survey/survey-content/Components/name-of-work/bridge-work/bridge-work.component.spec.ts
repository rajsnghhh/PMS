import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BridgeWorkComponent } from './bridge-work.component';

describe('BridgeWorkComponent', () => {
  let component: BridgeWorkComponent;
  let fixture: ComponentFixture<BridgeWorkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BridgeWorkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BridgeWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
