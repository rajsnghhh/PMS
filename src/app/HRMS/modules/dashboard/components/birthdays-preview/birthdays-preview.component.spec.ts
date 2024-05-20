import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BirthdaysPreviewComponent } from './birthdays-preview.component';

describe('BirthdaysPreviewComponent', () => {
  let component: BirthdaysPreviewComponent;
  let fixture: ComponentFixture<BirthdaysPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BirthdaysPreviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BirthdaysPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
