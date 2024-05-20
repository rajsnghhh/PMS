import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrnCancelCloseComponent } from './grn-cancel-close.component';

describe('GrnCancelCloseComponent', () => {
  let component: GrnCancelCloseComponent;
  let fixture: ComponentFixture<GrnCancelCloseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrnCancelCloseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrnCancelCloseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
