import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdcComponent } from './idc.component';

describe('IdcComponent', () => {
  let component: IdcComponent;
  let fixture: ComponentFixture<IdcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IdcComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IdcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
