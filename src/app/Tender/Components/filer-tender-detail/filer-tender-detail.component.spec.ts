import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilerTenderDetailComponent } from './filer-tender-detail.component';

describe('FilerTenderDetailComponent', () => {
  let component: FilerTenderDetailComponent;
  let fixture: ComponentFixture<FilerTenderDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilerTenderDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilerTenderDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
