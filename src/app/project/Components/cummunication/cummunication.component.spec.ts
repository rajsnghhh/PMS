import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CummunicationComponent } from './cummunication.component';

describe('CummunicationComponent', () => {
  let component: CummunicationComponent;
  let fixture: ComponentFixture<CummunicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CummunicationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CummunicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
