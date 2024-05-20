import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MrUpdateStatusComponent } from './mr-update-status.component';

describe('MrUpdateStatusComponent', () => {
  let component: MrUpdateStatusComponent;
  let fixture: ComponentFixture<MrUpdateStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MrUpdateStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MrUpdateStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
