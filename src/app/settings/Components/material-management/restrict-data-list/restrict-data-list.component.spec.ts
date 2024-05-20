import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestrictDataListComponent } from './restrict-data-list.component';

describe('RestrictDataListComponent', () => {
  let component: RestrictDataListComponent;
  let fixture: ComponentFixture<RestrictDataListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RestrictDataListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestrictDataListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
