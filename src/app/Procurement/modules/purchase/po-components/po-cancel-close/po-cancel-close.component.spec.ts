import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoCancelCloseComponent } from './po-cancel-close.component';

describe('PoCancelCloseComponent', () => {
  let component: PoCancelCloseComponent;
  let fixture: ComponentFixture<PoCancelCloseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoCancelCloseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoCancelCloseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
